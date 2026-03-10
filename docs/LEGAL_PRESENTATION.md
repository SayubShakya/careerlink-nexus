# ⚖️ CareerLink Nexus — Legal Risks (1-Minute Script)
> CIS047-3 | Team Nexus | University of Bedfordshire

---

## 🎤 SCRIPT — READ THIS OUT LOUD

---

"Hi everyone.

CareerLink Nexus is a job portal that stores **student CVs, emails, and personal data**.
The moment you handle people's data — the law applies to you.

We face **two sets of laws** — Nepal and UK.

---

In **Nepal**, the **Privacy Act 2075** says we must protect user data.
Worst case? A developer accidentally pushes our `.env` file to GitHub.
A hacker downloads **5,000 student profiles** in minutes. Criminal charges follow.
Best case? We add a Privacy Policy and never commit secrets to GitHub. Simple fix.

Also in Nepal, the **Electronic Transactions Act 2063** covers online fraud.
Worst case? A fake employer posts scam jobs — 200 students get tricked.
Best case? We verify employers before they can post. Trust by design.

---

In the **UK**, **GDPR** is the big one.
Worst case? A student wants to delete their account — we have no delete button.
They report us to the **ICO**. Potential fine: **£17.5 million**.
Best case? We add a Delete Account button. One endpoint. Massive legal protection.

Finally, the **Computer Misuse Act 1990** covers API security.
Worst case? An open API route exposes every user profile publicly.
Best case? Every route has authentication middleware. A `401 Unauthorized` is our shield.

---

The lesson?

**The difference between disaster and compliance is tiny** —
a `.gitignore` entry, a Privacy Policy, a delete button, one middleware function.

We are treating CareerLink like a real product — because laws don't care that it's a student project.

Thank you."

---

## ⏱️ Time: ~60 seconds at a natural pace
