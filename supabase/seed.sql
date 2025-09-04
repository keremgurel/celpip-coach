-- Seed data for CELPIP Speaking prompts
-- Each task type has 5 prompts for MVP

-- Task 1: Advice (30s prep, 90s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('advice_001', 1, 'A friend of yours is planning to move to a new city for work. They are feeling nervous about this big change. Give them some advice on how to make this transition easier.', ARRAY['work', 'moving', 'change'], 3),
('advice_002', 1, 'Your younger sibling is struggling with time management in university. They always seem to be stressed about deadlines and assignments. What advice would you give them?', ARRAY['education', 'time-management', 'stress'], 3),
('advice_003', 1, 'A colleague at work is having trouble getting along with their team members. They often feel left out of group discussions and decisions. What suggestions would you offer?', ARRAY['work', 'relationships', 'teamwork'], 4),
('advice_004', 1, 'Your neighbor is thinking about adopting a pet but is worried about the responsibility and cost. They have never owned a pet before. What advice would you give them?', ARRAY['pets', 'responsibility', 'lifestyle'], 2),
('advice_005', 1, 'A family member is considering starting their own business but is afraid of the financial risks involved. They have a stable job but dream of being their own boss. What would you recommend?', ARRAY['business', 'risk', 'career'], 5);

-- Task 2: Personal Experience (30s prep, 90s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('experience_001', 2, 'Describe a time when you had to overcome a significant challenge. What was the situation, and how did you handle it?', ARRAY['challenge', 'overcoming', 'personal'], 3),
('experience_002', 2, 'Tell me about a memorable trip you took. Where did you go, what did you do, and why was it special to you?', ARRAY['travel', 'memories', 'adventure'], 2),
('experience_003', 2, 'Describe a time when you learned something new that changed your perspective on life. What did you learn and how did it affect you?', ARRAY['learning', 'perspective', 'growth'], 4),
('experience_004', 2, 'Tell me about a time when you helped someone in need. What was the situation, and how did you feel about helping them?', ARRAY['helping', 'kindness', 'community'], 3),
('experience_005', 2, 'Describe a moment when you felt proud of an accomplishment. What did you achieve, and why was it important to you?', ARRAY['achievement', 'pride', 'success'], 3);

-- Task 3: Describe a Scene (30s prep, 60s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('scene_001', 3, 'Look at this picture of a busy marketplace. Describe what you see happening in the scene.', ARRAY['marketplace', 'busy', 'people'], 2),
('scene_002', 3, 'Look at this image of a family having dinner together. Describe the scene and the atmosphere.', ARRAY['family', 'dinner', 'home'], 2),
('scene_003', 3, 'Look at this photo of a construction site. Describe what is happening and what you can see.', ARRAY['construction', 'work', 'building'], 3),
('scene_004', 3, 'Look at this picture of a park on a sunny day. Describe the scene and the activities you can see.', ARRAY['park', 'outdoor', 'recreation'], 2),
('scene_005', 3, 'Look at this image of a library. Describe what you see and the atmosphere of the place.', ARRAY['library', 'quiet', 'study'], 3);

-- Task 4: Predictions (30s prep, 60s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('prediction_001', 4, 'How do you think technology will change the way we work in the next 10 years?', ARRAY['technology', 'work', 'future'], 4),
('prediction_002', 4, 'What do you think will be the biggest environmental challenges in the coming decades?', ARRAY['environment', 'challenges', 'future'], 4),
('prediction_003', 4, 'How do you think education will evolve with the increasing use of online learning?', ARRAY['education', 'online', 'learning'], 3),
('prediction_004', 4, 'What changes do you predict in the way people communicate with each other?', ARRAY['communication', 'social', 'technology'], 3),
('prediction_005', 4, 'How do you think cities will change to accommodate growing populations?', ARRAY['cities', 'population', 'urban'], 4);

-- Task 5: Compare and Persuade (60s prep, 60s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('compare_001', 5, 'Compare living in a big city versus living in a small town. Which would you recommend and why?', ARRAY['city', 'town', 'lifestyle'], 4),
('compare_002', 5, 'Compare online shopping with traditional shopping in stores. Which do you think is better and why?', ARRAY['shopping', 'online', 'traditional'], 3),
('compare_003', 5, 'Compare working from home versus working in an office. Which approach do you think is more effective?', ARRAY['work', 'remote', 'office'], 4),
('compare_004', 5, 'Compare public transportation with private vehicles. Which do you think is better for the environment and why?', ARRAY['transportation', 'environment', 'public'], 4),
('compare_005', 5, 'Compare traditional books with e-books. Which do you prefer and why?', ARRAY['books', 'reading', 'technology'], 3);

-- Task 6: Difficult Situation (60s prep, 60s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('difficult_001', 6, 'You are at a restaurant and your food arrives cold and poorly prepared. The server asks how everything is. What would you do?', ARRAY['restaurant', 'complaint', 'service'], 3),
('difficult_002', 6, 'Your neighbor''s dog barks loudly every night, keeping you awake. You need to address this issue. How would you handle it?', ARRAY['neighbor', 'noise', 'conflict'], 3),
('difficult_003', 6, 'You are in a group project at work, and one team member is not contributing their fair share. How would you address this situation?', ARRAY['work', 'team', 'conflict'], 4),
('difficult_004', 6, 'You ordered an expensive item online, but it arrived damaged. The company is not responding to your emails. What would you do?', ARRAY['online', 'damage', 'customer-service'], 3),
('difficult_005', 6, 'You are at a family gathering, and a relative makes an offensive comment. Other family members are present. How would you respond?', ARRAY['family', 'offensive', 'conflict'], 4);

-- Task 7: Express Opinions (30s prep, 90s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('opinion_001', 7, 'Do you think social media has a positive or negative impact on young people? Explain your opinion with reasons and examples.', ARRAY['social-media', 'young-people', 'impact'], 4),
('opinion_002', 7, 'In your opinion, what is the most important quality for a good leader? Support your answer with examples.', ARRAY['leadership', 'qualities', 'management'], 4),
('opinion_003', 7, 'Do you think it is better to work for a large company or a small company? Give reasons for your preference.', ARRAY['work', 'company-size', 'career'], 3),
('opinion_004', 7, 'What is your opinion on the importance of learning a second language? Support your view with examples.', ARRAY['language', 'learning', 'education'], 3),
('opinion_005', 7, 'Do you think technology makes our lives easier or more complicated? Explain your position with specific examples.', ARRAY['technology', 'lifestyle', 'convenience'], 4);

-- Task 8: Unusual Situation (30s prep, 60s speak)
INSERT INTO prompts (id, task_type, text, tags, difficulty) VALUES
('unusual_001', 8, 'Imagine you are the mayor of your city for one day. What would you do to improve the city?', ARRAY['mayor', 'city', 'improvement'], 4),
('unusual_002', 8, 'If you could have dinner with any person from history, who would it be and what would you talk about?', ARRAY['history', 'dinner', 'conversation'], 3),
('unusual_003', 8, 'Imagine you discover a new planet. What would you name it and why?', ARRAY['planet', 'discovery', 'naming'], 3),
('unusual_004', 8, 'If you could create a new holiday, what would it celebrate and how would people celebrate it?', ARRAY['holiday', 'celebration', 'creation'], 3),
('unusual_005', 8, 'Imagine you are a teacher for one day. What subject would you teach and what would be your main lesson?', ARRAY['teaching', 'education', 'lesson'], 3);
