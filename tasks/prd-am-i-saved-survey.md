# PRD: "Am I Saved" Survey Lead Magnet

## Problem / Rationale

Voice of Repentance has clear calls to read the blog, hear the music, and meet Selah — but no entry point for a first-time visitor who is asking the spiritual question underneath everything. The "Am I Saved?" survey is a lead-magnet walk through the Romans Road in regular language: eight honest self-examination questions, followed by an assessment that names and dismantles the "I'm measuring my good works" logic most seekers bring. Rom 10:13 is preserved undiluted — the call and the walk are not optional.

Lead-capture goal: after the assessment, the visitor submits name + email and receives the full assessment by email (thank-you, assessment body, echoed reflections, invitation back to voiceofrepentance.com, signed Troy). Troy receives a Telegram notification through the existing VOR contact handler.

Shareable URL: `https://www.voiceofrepentance.com/am-i-saved`.

## Architecture

```
User → voiceofrepentance.com
  Hero CTA (right-side card): "Take the Survey"
    → /am-i-saved (single Astro page, vanilla-JS step navigation)
      → 8 questions, optional reflections per question (localStorage)
        → Assessment screen
          → name + email submit
            → POST https://app.voiceofrepentance.com/api/vor/contact
              { name, email, message: "", source: "am-i-saved-survey", reflections: [...] }

Ezra backend:
  /api/vor/contact → writes to vor_crm.db, drops on asyncio queue
  contact_handler: new branch for source="am-i-saved-survey"
    → deterministic HTML email template (no LLM) containing the full assessment
    → send_email via iCloud SMTP
    → Telegram ping to Troy
    → CRM status update
```

## Content — The Questions (exact wording)

Each question gets its own screen with an optional reflection textarea.

### Q1. The Mirror in Private

When you are alone with yourself and nobody is watching — not your spouse, not your coworkers, not the people at church — what does the real version of you look like? The one who shows up in your private thoughts, your browsing history, your reaction when someone cuts you off in traffic, your quiet resentments. Would you be proud of that person?

### Q2. The Standard You Already Hold

Picture the highest human being you can imagine. Selfless love. Unfailing patience. Complete honesty. Genuine care for strangers. Real self-discipline. You already know that standard exists because you measure other people by it all the time. How close are you to it on your best day? How close on your worst?

### Q3. The Scoreboard

If every thought, word, and action of your life were weighed, the good on one side and the wrong on the other, which side do you think would drop? And if the scale tipped the wrong way, what exactly would make it right again? What do you owe, and how do you plan to pay it?

### Q4. The Exit

If you died tonight in your sleep, what do you believe would happen? Not what you hope. Not what sounds polite at a funeral. What do you actually believe, in the place nobody else can see? And where does that belief come from — evidence, instinct, or something somebody told you once?

### Q5. The Self-Rescue Problem

Have you ever genuinely tried to become a better person? Made a resolution, started a discipline, promised yourself you would change? How long did it last? What does that tell you about whether effort alone can fix what is actually wrong inside you?

### Q6. The Offer You Did Not Earn

Imagine someone who never did anything wrong willingly stood in for everything you have ever done. Not because you earned it. Not because you deserved it. Because he decided, before you were even born, that your debt was his to pay. What would you do with an offer like that?

### Q7. The Turn

Suppose that offer is real. Suppose the one who made it is standing in front of you right now, holding his hand out. Accepting it is not a prayer you recite or a box you check. It is a turning — walking away from who you have been and toward who he says you can become. Are you willing to turn?

### Q8. The First Words

If the answer to the last question is yes — or even closer to yes than you have been before — what is stopping you, right now, from telling him so? Not a stranger. Not a minister. Him. Would you say it out loud, in your own words, and mean it?

## Content — The Assessment (exact wording)

Rendered after Q8. The `###` headings are real section breaks. The body is the same in the frontend `src/data/survey.ts` and in the backend email template.

---

# The Assessment

If you worked through those eight questions, you probably did what most people do. **You started scoring.**

You looked at the questions and measured yourself, maybe honestly, maybe generously, maybe harshly. You weighed how much good you have done against how much wrong. You landed somewhere on the scale. Not as bad as some. Not as holy as others. Clinging, probably, to the hope that the balance would come out okay in the end.

Here is the first hard truth. **The scale was never the measurement.**

Before anyone reads a single verse of scripture, most of us walk around with a private ledger in our heads. Good on one side. Bad on the other. We spend our lives hoping the good column wins. Every religion ever invented runs on some version of that logic. Do enough right. Avoid enough wrong. Hope it counts.

Christianity is the one faith on earth that says the ledger does not work that way. Not because the ledger is rigged. Because **the scale has already tipped, for every single person, without exception.** The Bible says it plainly: *"all have sinned and fall short of the glory of God"* (Romans 3:23). Not some. Not the worst of us. All of us. The best day of your life was not good enough. Neither was mine. The standard is not *better than the people around you*. The standard is *perfect*. And if you are honest for three minutes, you know you are not that.

The second hard truth is what that gap costs. *"The wages of sin is death"* (Romans 6:23). This is not a threat. It is an accounting statement. Sin earns a paycheck, and the paycheck is separation from God, forever. No amount of extra credit in the good column pays it down. The books do not work that way.

### What you did not earn

Here is where the story turns, and it is the reason the whole book was written.

*"God demonstrates his own love for us in this: While we were still sinners, Christ died for us"* (Romans 5:8).

Read that carefully. **Christ did not wait for you to clean up.** He did not wait for the good column to get respectable. He paid the bill while the ink in the bad column was still wet. Your score was never going to be the thing that saved you. Someone else's score was.

This is the part most people miss. You are not being asked to balance your own books. You are being asked to let Someone else pay them and walk away from the ledger entirely. That is not how human systems work. It is not how employment works, or court works, or credit works. It is not how the religion most of us grew up with works either. But it is how God works, and if you try to translate it into a transaction you can control, you will never understand it.

### What about timing

There is a scene in the Bible that answers the question every late-in-life person eventually asks. *"Is it too late?"*

Jesus was crucified with two criminals, one on each side of Him. Both were dying. Both had run out of runway. One mocked Him. The other called out, *"Jesus, remember me when you come into your kingdom."* That was it. No baptism. No resolution to do better. No good column to point to. Just a man at the final hour of his life, turning his head and calling. Jesus answered him: *"Today you will be with me in paradise."*

That is the entire story, compressed. The criminal had no time to walk it out. No time to attend church, read his Bible, or repair his relationships. He had one turn and one call, and that was enough, because the payment had already been made by the One hanging next to him.

**Timing is not the point. The call is the point.** Whether you are twenty-two or sixty-eight or taking your last breath in a hospital bed, the door is open if you will turn and call.

### But the call is not optional

Here is where many modern Christians get soft, and I will not.

The Bible does not say everyone is saved. It does not say a general respect for Jesus is enough. It does not say you can go on living exactly as you were, unchanged, and collect the gift at the end. *"If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved"* (Romans 10:9). And: *"Everyone who calls on the name of the Lord will be saved"* (Romans 10:13).

**You must call.** Calling is not ambient appreciation. It is not cultural Christianity. It is not checking a box you were raised inside. Calling is turning. It is the conscious choice to stop running your life by your own ledger and start following the One who paid it. That is what the whole Bible means by the word *repentance*. Turning.

And then you walk with Him. Not as a performance. Not as another round of good-column scoring. As the ordinary daily life of someone who has been bought with a price and is no longer his own.

### Where that leaves you

If you worked through those eight questions and realized your ledger is never going to balance, **that is the point.** The questions were not asking you to score yourself. They were asking you to admit that you cannot.

The next move is simple and not easy. It is not a prayer someone else writes for you. It is not a decision you hand to a minister. It is a turn, in your own words, toward the One who already paid. If the criminal on the cross could do it with three sentences as he died, you can do it right now, in the chair you are sitting in, with whatever words you actually have.

Say them to Him. Mean them. Then start walking.

---

## Design Notes

### Frontend (VOR-blog)

- **Route**: `/am-i-saved` — new file `src/pages/am-i-saved.astro`.
- **State**: `localStorage` key `vor:am-i-saved-survey` stores `{ step, reflections: {1..8: string}, submitted: bool }`. Resumable on refresh / return.
- **Navigation**: URL hash (`#q1` ... `#q8`, `#assessment`, `#sent`) with hashchange listener. Browser back/forward work naturally.
- **Focus management**: on step transition, focus the new question heading. ARIA live region announces step changes.
- **Hero CTA**: right-side card on desktop (empty space next to the `max-w-2xl` content column); inline link on mobile (small height addition).
- **Submission**: fetch to `https://app.voiceofrepentance.com/api/vor/contact` with the structured payload. Show success state on 200; error state with retry link otherwise.
- **Content source**: `src/data/survey.ts` derived from this PRD. If the content changes, update both this PRD and the backend template in lockstep.

### Backend (ezra-assistant)

- **Payload schema**: extend `ContactRequest` in `src/ezra/routes/vor.py` to accept `reflections: list[Reflection] | None`. `Reflection = {step: int, heading: str, text: str}`. Persist as JSON in the existing `notes` column of `vor_crm.db` — no migration needed.
- **Handler branch**: in `src/ezra/cron/contact_handler.py`, add `if source == "am-i-saved-survey"` branch that calls a new `_send_survey_assessment(name, email, reflections)`. Bypasses the LLM composer (deterministic template, no agent graph, no nondeterminism).
- **Template**: `src/ezra/cron/templates/survey_email.py`. Exports `SUBJECT` and `render(name, reflections)`. HTML email body contains the assessment verbatim, personalized with name + echoed reflections, signed Troy.
- **Telegram**: new template tag `[VOR CONTACT] 'Am I Saved' survey completed` with reflection count.

### Email body outline

```
Hi {{name}},

Thanks for taking the "Am I Saved" questionnaire. Your assessment is below. Take your time with it.

[FULL ASSESSMENT BODY, HTML-rendered]

Here are the notes you jotted as you went:      (only if reflections non-empty)

  [Question 1 heading]
    [reflection text]

  [Question 3 heading]
    [reflection text]

  ...

If any of this stirred something, I'd love to hear from you. Just reply to this email.

Either way, come back and walk with us at voiceofrepentance.com.

Troy
```

## Rollout

1. Frontend: create data module + page + hero edit, run `npm run dev`, walk through locally.
2. Backend: extend Pydantic model, add handler branch, add template. Local curl test against Ezra on `:8400`.
3. Frontend: push to main, Cloudflare auto-deploys.
4. Backend: restart Ezra on the Mac Mini so the handler picks up the new source.
5. Live smoke test: submit as Troy, verify email + Telegram + CRM row.
6. Share the URL on Facebook.

## Validation checklist

Covered in the plan file at `/Users/hackstert/.claude/plans/indexed-riding-locket.md` under "Verification". Not duplicated here.

## Content changes

If the questions or the assessment copy change in the future, update three files together:

1. `tasks/prd-am-i-saved-survey.md` (this document — source of truth)
2. `src/data/survey.ts` (frontend)
3. `ezra-assistant/src/ezra/cron/templates/survey_email.py` (backend email)

A comment in the two derivative files points back to this PRD.

## Email banner asset

The faded wheat-field banner travels **inside the assessment email** as
a CID-inlined image (multipart/related). This removes the CDN entirely
from the email delivery path, which is why it stopped rendering under
Cloudflare Pages edge-cache poisoning.

The banner lives in the Ezra backend repo, bundled with the template:

```
ezra-assistant/src/ezra/cron/templates/assets/email-banner.jpg
```

Faded 1200x240 JPEG, ~30 KB, ~35% opacity blend of the VOR hero image
over white. To regenerate:

```bash
# 1. Produce the new banner from the current VOR hero:
python3 - <<'PY'
from PIL import Image
src = Image.open('/Users/hackstert/Projects/web-sites/VOR-blog/public/images/site/wheat-field-main-hero.png').convert('RGB')
scaled = src.resize((1200, int(src.height * 1200 / src.width)), Image.LANCZOS)
top = (scaled.height - 240) // 2
banner = scaled.crop((0, top, 1200, top + 240))
white = Image.new('RGB', banner.size, (255, 255, 255))
Image.blend(banner, white, 0.65).save(
    '/Users/hackstert/Projects/ezra-assistant/src/ezra/cron/templates/assets/email-banner.jpg',
    'JPEG', quality=78, optimize=True,
)
PY

# 2. Restart Ezra to pick up the bundled asset.
# 3. Fire a test POST to verify the new banner renders.
```

If you change the fade level, crop, or source image, only this one file
needs to move -- there is no CDN URL to keep in sync.
