---
title: How to edit Google Form responses after they're submitted (free)
description: Get the edit link for every Google Form response in your response sheet, so you or the respondent can change answers later. Free Apps Script, works for past responses too.
image: https://decodedxr.github.io/form-edit-links/assets/cover.png
---
{% raw %}

# How to edit Google Form responses after they're submitted (free)

Someone submits your Google Form with a typo in their email address, or wants to change their answer a week later. Editing the response sheet doesn't help: the sheet is a copy, and the form's own response (what shows in the Responses tab and in future exports) stays wrong.

Google Forms does create a private **edit link** for every response, but it's only shown once, to the respondent, right after they submit. This guide gets all of those links into your response sheet, using [Form Edit Links](https://github.com/DecodedXR/form-edit-links), a free, MIT-licensed Apps Script.

## Step 1: Open the response sheet

In your form, open the **Responses** tab and click **Link to Sheets** (or **View in Sheets** if it's already linked). That's the spreadsheet the script goes into.

## Step 2: Add the script

1. In the response sheet: **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with [this `Code.gs`](https://github.com/DecodedXR/form-edit-links/blob/main/Code.gs) and click **Save**.
3. Reload the sheet. A **✏️ Edit Links** menu appears.

## Step 3: Turn it on

**✏️ Edit Links → Turn On**, then approve Google's permission prompt ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**). It's your own script.

A new **Edit Link** column appears with a link on every existing response, and each new response gets its link within a few seconds of arriving.

## Step 4: Use the links

- **Fix an answer yourself:** click the row's Edit Link, change the answer, and submit. The form's response and the sheet row both update.
- **Let people update their own answers:** first turn on **Settings → Responses → Allow response editing** in the form. Then send each person their link with a mail merge, using `{{Edit Link}}` in the email. [Free Mail Merge](https://github.com/DecodedXR/sheets-mail-merge) works on this sheet: in its script, set `EMAIL_COL` to your email question's column name (for example `'Email Address'` if the form collects emails).

## FAQ

**Is an edit link private?** It isn't tied to a login: anyone who has the link can change that response. Send each link only to its own respondent.

**Do old responses get links?** Yes. Turning it on fills every row that doesn't have one, and **Fill Missing Links Now** does it again any time.

**What if two people submit in the same second?** Rows are matched to responses by timestamp, so links could swap in that rare case. Spot-check if your form gets bursts of submissions.

**How do I stop it?** **✏️ Edit Links → Turn Off**. Links already in the sheet keep working.

---

[Get the script on GitHub](https://github.com/DecodedXR/form-edit-links) · [More free Google Sheets scripts](https://decodedxr.github.io/free-google-sheets-scripts/)
{% endraw %}
