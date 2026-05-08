---
title: "What Medicine Taught Me About AI in the Church"
date: 2026-05-07
description: "Five lessons from scrutinizing technology in clinical medicine, applied to the questions ministry leaders are facing right now. The framework I wish someone had handed me when I started thinking about AI in the church."
subtitle: "The cornerstone of the Examining AI in the Church series -- a physician's framework for ministry leaders making AI decisions for their congregations."
tags: ["ai-ministry", "ai", "leadership", "clinical informatics", "selah"]
draft: true
---
I have had a version of this conversation more than once now, with patients, doctors, nurses, and now pastors. A new technology arrives. It promises to make something easier, faster, or smarter. The person in front of me is mostly enthusiastic. Then, almost as an aside, they say something like, "Is that even okay?"

That question is the thread that runs through my whole career. I have spent more than two decades in medicine -- internal medicine, preventive medicine, public health, and clinical informatics -- and across all of that, my job has been to ask whether a new tool is actually safe to put between a clinician and a patient. The technology has changed every few years. The discipline of scrutiny has not. Patients are the priority. The bar is human harm. Anything that approaches that bar gets weighed carefully, or it does not get used.

Over the last three to five years, that same discipline has had to expand to cover artificial intelligence specifically. In my current role at the VA, I help shape how AI gets adopted into care environments where the cost of getting it wrong is measured in real human consequences. The work has taught me what careful examination of AI looks like when the people on the receiving end are not abstractions, but the patients I am responsible for.

I am also a believer, and I am building a fine-tuned ministry AI for my own church under the Voice of Repentance ministry. The rigor I bring to AI for patients is the rigor that needs to be brought to AI for congregations. The audience is different. The stakes are not smaller. A pastor's people are entrusting their spiritual formation to their leaders the way a patient entrusts their body to their physician. **That trust deserves the same scrutiny.**

That is the moment most ministry leaders are sitting in right now. Some have already adopted these tools. Some are afraid of them. Almost none of them have the framework to think clearly about which is which. This essay is not an argument for or against AI in ministry. **It is the framework I wish someone had handed me when I started thinking about this.** Five lessons from clinical AI work, applied to the church.

### 1. Decision support, not replacement

The earliest mistake in clinical AI was treating it as a replacement for the physician. Vendors pitched it that way. Hospitals bought it that way. And every time it failed in the real world, it failed because the human had been removed from the loop.

The mature framing -- the one we have spent a decade learning -- is that AI is decision support. It is a tool that makes the clinician faster, sharper, and less likely to miss something. It is not a substitute for clinical judgment. It does not bear the weight of the doctor-patient relationship. It does not see the patient. It augments the person who does.

That same distinction is the one ministry leaders need to make first.

A sermon-prep AI is decision support for the pastor's preparation. It is not preaching. A counseling chatbot is decision support for someone navigating a question outside business hours. It is not pastoral care. A scripture search assistant is decision support for study. It is not the Holy Spirit illuminating the text.

The question to ask of any tool is not "what does this replace?" The question is **"what does this augment, and what relationship still belongs to a human?"** If a vendor is telling you their tool replaces a person, walk away. The mature tools are the ones that know what they are not.

### 2. Hallucination is a safety event

In clinical AI, when a model fabricates information that sounds plausible, that is not a curiosity. It is a patient safety event. We treat it the way we treat any other medical error -- we report it, we root-cause it, we change practice to prevent it.

The church has not yet absorbed that this is the right posture for ministry AI. Most leaders treat hallucination as a quirk. A funny anecdote about ChatGPT making up a Bible verse. They share it at staff meetings and laugh.

That is the wrong response. **A fabricated scripture reference in a sermon is not a quirk. It is the AI equivalent of a misdosed medication.** A confidently misattributed quote from Augustine is not entertainment. It is misinformation entering the spiritual formation pipeline of a congregation. A theological error stated with the confidence of fact is exactly the kind of small misshaping that compounds over years.

Treat hallucinations as safety events. Have a process. Verify every scripture reference an AI gives you. Verify every patristic quotation. Verify every claim about church history before it leaves your study. If you are not willing to do that work, you are not ready to use the tool.

This is the lesson medicine paid for in real patients. The church should not have to pay it again.

### 3. Scope of practice

Every clinician operates within a defined scope of practice. A nurse practitioner is not an interventional cardiologist. A radiologist is not a primary care doctor. The scope of practice exists because the consequences of operating outside it are serious, and because the person on the receiving end of that care needs to know what they are getting.

AI tools should have a scope of practice too. Most do not, and that is where the trouble starts.

A sermon-prep tool has a scope. It helps a trained, ordained, theologically formed person prepare to preach. That is not the same scope as a counseling tool, which has to navigate human pain, mental health, marital crisis, and the limits of what a chatbot should ever say. A scripture-search tool has a different scope still. A Bible-trivia answer engine has yet another.

When a single tool tries to cover all of those scopes -- and many of the consumer AI tools do -- the leader using it has to enforce the scope themselves. That means knowing when to use the tool and when to put it down. It means knowing what the tool was trained to do and what it was not.

The clinical principle applies here. **Define the scope before deployment. Stay inside it. Train your staff to recognize when a use is drifting outside scope, and stop.**

### 4. Data stewardship

In healthcare, patient data is governed by HIPAA, by institutional policy, by professional obligation, and by the basic principle that patients are entrusting us with their most sensitive information. We do not paste it into consumer AI chat windows. We do not feed it to vendors whose training pipelines we have not vetted. We do not assume that a free tool is free of cost. The cost is the data.

Pastoral data has fewer formal rules. It does not have less real obligation.

Every leader needs to think clearly about what data is leaving the church when they use an AI tool. Counseling notes. Prayer requests. Names of people in difficult situations. Drafts of difficult emails. Information about staff conflicts. The sensitive content of pastoral life. When that content gets pasted into a consumer AI chat window, it almost always becomes part of a vendor's data pipeline in some form. It may train a future model. It may sit in logs that a vendor employee can read. It may be subpoenaed.

A useful rule, until you know better: **do not put anything into an AI tool that you would not be comfortable seeing in a vendor's database, on a vendor's screen, or in a court filing.** If the use case requires data that sensitive, the tool you need is one that runs locally, where the data does not leave your control. Which leads to the last lesson.

### 5. Local control where it matters

The most sensitive clinical AI in healthcare runs on local infrastructure. Not because cloud AI is bad. Because some data should not leave the building.

Ministry has its own version of that line, and most leaders have not thought about where it sits. Most consumer AI tools are cloud tools. The data goes to the vendor. The model that answers your question is run on the vendor's servers. The vendor sets the rules, the privacy policy, the data retention, and the limits of what the tool will and will not say. For some uses that is fine. For other uses it is not.

This is the question I kept asking myself, and ultimately the question that pushed me to start building Selah. I wanted a ministry AI that ran on infrastructure I controlled. I wanted to know exactly what the model had been trained on and what behaviors it had been shaped toward. I wanted theological accuracy that did not depend on a vendor's roadmap. I wanted pastoral data that never left the house.

Selah is a fine-tuned Gemma model, running locally, shaped on a question-and-answer corpus that was hand-built for the kind of ministry questions Voice of Repentance actually receives. It is not the right answer for every church. It is the right answer for a particular set of decisions about scope, data, and theological control. Future essays in this series will document the build in detail -- what is working, what is not, and what other ministries should consider before going down the same road.

### The leader's posture

What I want ministry leaders to take away from this is not a checklist. It is a posture.

You are the pastor or elder or director. You are responsible for what the technology you adopt does to the people under your care. **That responsibility does not go away because the tool is novel or because the vendor is enthusiastic.** It is the same responsibility you carry when you bring any other practice into the life of your church. You weigh it. You name what it augments and what it must not replace. You build a process for the failure modes. You define the scope. You protect the data of the people who trust you. And you do not outsource any of that judgment to the technology itself.

The church does not need leaders who fear AI. It also does not need leaders who are infatuated with it. **It needs leaders who understand it well enough to make good stewardship decisions on behalf of their congregations.** That is a high bar. It is also exactly the bar Christian leaders have been called to clear with every previous wave of cultural and technological change.

The tools are not going to slow down to wait for the church to catch up. The understanding is the work, and it starts now.

The rest of this hub is where I do that work -- in the open, with my own ministry as the test case, and with the same clinical-grade care I would bring to any other deployment that affects the people I am responsible for.
