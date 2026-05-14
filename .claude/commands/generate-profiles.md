# /generate-profiles — Ralph Wiggum Autonomous Loop

You are running an autonomous loop to generate realistic seed data for the SkillBridge database.

## Your Task

Each iteration, generate ONE new tutor profile OR service listing as a valid JSON object matching the schema below, then POST it to the local API.

## Schemas

**Tutor POST body** (`POST http://localhost:4000/tutor`):
```json
{
  "user": "<valid user ObjectId>",
  "subjects": ["Subject1", "Subject2"],
  "level": "beginner|intermediate|advanced|all",
  "hourlyRate": 25,
  "format": "online|in-person|both",
  "availability": "Weekdays 5-9pm, weekends flexible",
  "description": "2-3 sentence description of teaching style and experience",
  "imgs": [],
  "category": "<valid category ObjectId or omit>"
}
```

**Service POST body** (`POST http://localhost:4000/service`):
```json
{
  "user": "<valid user ObjectId>",
  "title": "I will ...",
  "description": "2-3 sentence description of the service",
  "price": 50,
  "deliveryDays": 7,
  "tags": ["tag1", "tag2", "tag3"],
  "imgs": []
}
```

## Instructions

1. Alternate between generating tutors and services each iteration
2. Vary subjects/skills: Math, Physics, Chemistry, Biology, English, Python, JavaScript, Data Science, Graphic Design, Video Editing, Web Development, Music, Spanish, French, etc.
3. Vary price ranges: tutors $15-$80/hr, services $20-$200
4. Make descriptions realistic and specific — not generic
5. Use the Bash tool to POST the generated JSON to the API
6. Report what was created after each POST

## Loop Behavior

After each generation, immediately generate the next one. Continue until you have created at least 10 listings (mix of tutors and services). Then stop and report the full list of what was created.

**Important:** You need a valid `user` ObjectId. Before starting, fetch users from `GET http://localhost:4000/user` and use those IDs.
