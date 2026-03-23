const CV = require('../models/CV');
const JobSeeker = require('../models/JobSeeker');
const pdfGenerator = require('../utils/pdfGenerator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const path = require('path');
const fs = require('fs');

// Get all CVs for the current user
exports.getAllCVs = catchAsync(async (req, res, next) => {
    const cvs = await CV.findAll({
        where: { user_id: req.user.id },
        order: [['updated_at', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        results: cvs.length,
        data: {
            cvs
        }
    });
});

// Create a new platform CV
exports.createPlatformCV = catchAsync(async (req, res, next) => {
    const newCV = await CV.create({
        user_id: req.user.id,
        title: req.body.title || 'Untitled CV',
        type: 'platform',
        content: req.body.content || {}
    });

    res.status(201).json({
        status: 'success',
        data: {
            cv: newCV
        }
    });
});

// Get single CV details
exports.getCV = catchAsync(async (req, res, next) => {
    let whereClause = { id: req.params.id };

    // Only restrict by user_id if the user is a job seeker
    if (req.role === 'job_seeker') {
        whereClause.user_id = req.user.id;
    }

    const cv = await CV.findOne({
        where: whereClause
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            cv
        }
    });
});

// Delete a CV
exports.deleteCV = catchAsync(async (req, res, next) => {
    const cv = await CV.findOne({
        where: { id: req.params.id, user_id: req.user.id }
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    // If it's an uploaded file, delete from disk
    if (cv.type === 'uploaded' && cv.file_path && !cv.file_path.startsWith('http')) {
        // Handle both absolute paths (legacy) and relative paths (new)
        const filePath = path.isAbsolute(cv.file_path)
            ? cv.file_path
            : path.join(__dirname, '../../', cv.file_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await cv.destroy();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Download/View CV (Supports both uploaded and platform-generated)
exports.downloadCV = catchAsync(async (req, res, next) => {
    const cv = await CV.findByPk(req.params.id);

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    // CHECK PERMISSIONS
    if (req.role === 'job_seeker') {
        if (cv.user_id !== req.user.id) {
            return next(new AppError('Unauthorized: You can only download your own CVs.', 403));
        }
    } else if (req.role === 'employer') {
        // Employer can only download CVs of candidates who have applied to their jobs
        const Application = require('../models/Application');
        const JobListing = require('../models/JobListing');

        const hasApplication = await Application.findOne({
            where: { cv_id: cv.id },
            include: [{
                model: JobListing,
                where: { employer_id: req.user.id }
            }]
        });

        if (!hasApplication && req.role !== 'admin') {
            return next(new AppError('Unauthorized: You can only download CVs of candidates who have applied to your jobs.', 403));
        }
    } else if (req.role !== 'admin') {
        return next(new AppError('Unauthorized access to CV.', 403));
    }

    console.log(`[downloadCV] Permission granted for user=${req.user.id}, role=${req.role}, cv=${cv.id}`);

    // CASE 1: Platform-generated CVs — generate PDF on-the-fly
    if (cv.type === 'platform') {
        const user = await JobSeeker.findByPk(cv.user_id);
        const pdfBuffer = await pdfGenerator.generateCV(cv, user);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${cv.title.replace(/\s+/g, '_')}.pdf"`,
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-store'
        });
        return res.send(pdfBuffer);
    }
    // CASE 2: Uploaded CV with Cloudinary URL — proxy download through server
    // Direct Cloudinary CDN URLs return 401 due to account-level "PDF/ZIP delivery" restriction.
    // We fetch the binary via the authenticated Admin API and stream it to the client.
    if (cv.file_path && cv.file_path.startsWith('http')) {
        const https = require('https');
        const http = require('http');

        try {
            // Extract public_id from the Cloudinary URL
            const isAuthenticated = cv.file_path.includes('/authenticated/');
            const resourceType = cv.file_path.includes('/raw/') ? 'raw' : 'image';
            const splitOn = isAuthenticated ? '/authenticated/' : '/upload/';
            const urlParts = cv.file_path.split(splitOn);

            if (urlParts.length < 2) {
                console.warn(`[downloadCV] Could not parse Cloudinary URL: ${cv.file_path}`);
                return next(new AppError('CV file URL is malformed.', 500));
            }

            // Strip version prefix and any signature prefix
            let pathAfterDelivery = urlParts[1].replace(/^v\d+\//, '').replace(/^s--[^/]+--\//, '');
            const publicId = resourceType === 'raw'
                ? pathAfterDelivery
                : pathAfterDelivery.replace(/\.[^/.]+$/, '');

            const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
            const apiKey = process.env.CLOUDINARY_API_KEY;
            const apiSecret = process.env.CLOUDINARY_API_SECRET;

            // Use Admin API content endpoint to fetch the actual file binary
            // This uses Basic Auth (api_key:api_secret) and bypasses CDN ACL restrictions
            const contentUrl = `https://${apiKey}:${apiSecret}@api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload/${encodeURIComponent(publicId)}`;

            console.log(`[downloadCV] Fetching resource via Admin API: ${publicId}`);

            const metaReq = https.get(contentUrl, (metaRes) => {
                let metaBody = '';
                metaRes.on('data', chunk => metaBody += chunk);
                metaRes.on('end', () => {
                    try {
                        const meta = JSON.parse(metaBody);
                        if (metaRes.statusCode !== 200 || !meta.secure_url) {
                            console.error(`[downloadCV] Admin API error ${metaRes.statusCode}:`, metaBody.substring(0, 300));
                            return next(new AppError('Failed to retrieve CV from cloud storage.', 502));
                        }

                        // Stream the file from the secure_url via server (proxy)
                        // We need to follow the CDN URL but from server-side
                        const fileUrl = new URL(meta.secure_url);
                        const fileProtocol = fileUrl.protocol === 'https:' ? https : http;

                        console.log(`[downloadCV] Streaming file from: ${meta.secure_url}`);

                        // Try direct CDN access first (works if PDF delivery is enabled)
                        fileProtocol.get(meta.secure_url, (fileRes) => {
                            // If CDN returns 401, use the Admin API content download as fallback
                            if (fileRes.statusCode === 401) {
                                console.warn(`[downloadCV] CDN returned 401. Enable "PDF and ZIP delivery" in Cloudinary Settings > Security.`);
                                console.log(`[downloadCV] Attempting Admin API download fallback...`);

                                // Consume the failed response body
                                fileRes.resume();

                                // Use Cloudinary's explicit download_url from Admin API
                                // The Admin API resource endpoint returns the URL, but we can construct
                                // the authenticated content URL using the API
                                const cloudinary = require('../utils/cloudinary');

                                // Generate a download URL using the SDK
                                const downloadUrl = cloudinary.url(publicId, {
                                    resource_type: resourceType,
                                    type: isAuthenticated ? 'authenticated' : 'upload',
                                    sign_url: true,
                                    secure: true,
                                    flags: 'attachment'
                                });

                                // Try the signed URL with attachment flag
                                https.get(downloadUrl, (dlRes) => {
                                    if (dlRes.statusCode === 200) {
                                        const filename = cv.title ? cv.title.replace(/\s+/g, '_') + '.pdf' : 'cv.pdf';
                                        res.set({
                                            'Content-Type': dlRes.headers['content-type'] || 'application/pdf',
                                            'Content-Disposition': `inline; filename="${filename}"`,
                                            'Cache-Control': 'no-store'
                                        });
                                        if (dlRes.headers['content-length']) {
                                            res.set('Content-Length', dlRes.headers['content-length']);
                                        }
                                        return dlRes.pipe(res);
                                    }

                                    dlRes.resume();
                                    console.error(`[downloadCV] Signed URL also failed: ${dlRes.statusCode}`);
                                    console.error(`[downloadCV] ⚠️  FIX REQUIRED: Go to Cloudinary Dashboard → Settings → Security → Enable "PDF and ZIP files delivery"`);
                                    return next(new AppError(
                                        'CV download blocked by cloud storage security settings. Please contact the administrator to enable PDF delivery in Cloudinary settings.',
                                        502
                                    ));
                                }).on('error', (err) => {
                                    console.error('[downloadCV] Signed URL request failed:', err.message);
                                    if (!res.headersSent) next(new AppError('Failed to download CV.', 502));
                                });
                                return;
                            }

                            // Follow redirects
                            if (fileRes.statusCode === 301 || fileRes.statusCode === 302) {
                                const redirectProtocol = fileRes.headers.location.startsWith('https') ? https : http;
                                redirectProtocol.get(fileRes.headers.location, (redirectRes) => {
                                    const filename = cv.title ? cv.title.replace(/\s+/g, '_') + '.pdf' : 'cv.pdf';
                                    res.set({
                                        'Content-Type': 'application/pdf',
                                        'Content-Disposition': `inline; filename="${filename}"`,
                                        'Cache-Control': 'no-store'
                                    });
                                    if (redirectRes.headers['content-length']) {
                                        res.set('Content-Length', redirectRes.headers['content-length']);
                                    }
                                    redirectRes.pipe(res);
                                }).on('error', (err) => {
                                    console.error('[downloadCV] Redirect error:', err.message);
                                    if (!res.headersSent) next(new AppError('Failed to stream CV.', 502));
                                });
                                return;
                            }

                            if (fileRes.statusCode !== 200) {
                                fileRes.resume();
                                console.error(`[downloadCV] CDN returned unexpected ${fileRes.statusCode}`);
                                return next(new AppError('Failed to download CV from cloud storage.', 502));
                            }

                            // Success — stream the PDF to the client
                            const filename = cv.title ? cv.title.replace(/\s+/g, '_') + '.pdf' : 'cv.pdf';
                            res.set({
                                'Content-Type': fileRes.headers['content-type'] || 'application/pdf',
                                'Content-Disposition': `inline; filename="${filename}"`,
                                'Cache-Control': 'no-store'
                            });
                            if (fileRes.headers['content-length']) {
                                res.set('Content-Length', fileRes.headers['content-length']);
                            }
                            fileRes.pipe(res);
                        }).on('error', (err) => {
                            console.error('[downloadCV] CDN stream error:', err.message);
                            if (!res.headersSent) next(new AppError('Failed to stream CV file.', 502));
                        });

                    } catch (parseErr) {
                        console.error('[downloadCV] Failed to parse Admin API response:', parseErr.message);
                        return next(new AppError('Failed to retrieve CV metadata.', 502));
                    }
                });
            });

            metaReq.on('error', (err) => {
                console.error('[downloadCV] Admin API request failed:', err.message);
                return next(new AppError('Failed to reach cloud storage.', 502));
            });

            return; // Response handled by stream callbacks
        } catch (err) {
            console.error('[downloadCV] Unexpected error:', err.message);
            return next(new AppError('Failed to download CV from cloud storage.', 500));
        }
    }


    // CASE 3: Local file path
    if (!cv.file_path) {
        return next(new AppError('CV file path is missing', 404));
    }

    // Handle both absolute paths (legacy) and relative paths (new)
    const filePath = path.isAbsolute(cv.file_path)
        ? cv.file_path
        : path.join(__dirname, '../../', cv.file_path);

    console.log(`[downloadCV] Resolved file path: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`[downloadCV] Local file missing: ${filePath}`);
        return next(new AppError('CV file not found on server. It may have been uploaded on a different machine. Please ask the candidate to re-upload their CV.', 404));
    }

    res.download(filePath, cv.title);
});

// Upload a CV file
exports.uploadCV = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide a file to upload.', 400));
    }

    // For Cloudinary uploads, req.file.path or req.file.secure_url will contain the global URL
    // For local uploads (fallback), we store the relative path
    const filePath = req.file.path || req.file.secure_url;

    console.log(`[uploadCV] File processed. Path/URL: ${filePath}`);

    const newCV = await CV.create({
        user_id: req.user.id,
        title: req.body.title || req.file.originalname,
        type: 'uploaded',
        file_path: filePath
    });

    res.status(201).json({
        status: 'success',
        data: {
            cv: newCV
        }
    });
});

// Update a CV
exports.updateCV = catchAsync(async (req, res, next) => {
    const cv = await CV.findOne({
        where: { id: req.params.id, user_id: req.user.id }
    });

    if (!cv) {
        return next(new AppError('No CV found with that ID', 404));
    }

    const { title, content, is_primary } = req.body;

    if (title !== undefined) cv.title = title;
    if (content !== undefined && cv.type === 'platform') {
        cv.content = content;
        // Ensure Sequelize detects the JSON change
        cv.changed('content', true);
    }
    if (is_primary !== undefined) cv.is_primary = is_primary;

    await cv.save();

    res.status(200).json({
        status: 'success',
        message: 'CV updated successfully',
        data: {
            cv
        }
    });
});

