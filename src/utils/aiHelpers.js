// Simple keyword-based AI for hackathon

const categories = {
    "Programming": ["code", "javascript", "python", "react", "node", "html", "css", "bug", "error", "app", "web", "software"],
    "Design": ["design", "ui", "ux", "figma", "photoshop", "illustrator", "graphic", "logo"],
    "Mathematics": ["math", "calculus", "algebra", "geometry", "statistics", "equation"],
    "Science": ["science", "physics", "chemistry", "biology", "research"],
    "Language": ["language", "english", "writing", "essay", "grammar", "translation"],
    "Career": ["career", "job", "resume", "interview", "cv", "portfolio"]
};

const urgencyKeywords = {
    "Urgent": ["urgent", "asap", "immediately", "emergency", "deadline", "quick"],
    "High": ["important", "critical", "soon", "today"],
    "Medium": ["help", "need", "please", "request"],
    "Low": ["curious", "wondering", "future", "maybe"]
};

// AI: Auto categorize request
function autoCategorize(title, description) {
    const text = (title + " " + description).toLowerCase();

    for (let [category, keywords] of Object.entries(categories)) {
        for (let keyword of keywords) {
            if (text.includes(keyword)) {
                return category;
            }
        }
    }
    return "Other";
}

// AI: Suggest tags
function suggestTags(title, description) {
    const text = (title + " " + description).toLowerCase();
    const words = text.split(/\s+/);
    const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "help", "need"];

    const tags = [...new Set(words.filter(word =>
        word.length > 3 &&
        !commonWords.includes(word) &&
        !commonWords.includes(word.replace(/[^a-zA-Z]/g, ''))
    ))];

    return tags.slice(0, 5);
}

// AI: Detect urgency
function detectUrgency(title, description) {
    const text = (title + " " + description).toLowerCase();

    for (let [level, keywords] of Object.entries(urgencyKeywords)) {
        for (let keyword of keywords) {
            if (text.includes(keyword)) {
                return level;
            }
        }
    }
    return "Medium";
}

// AI: Suggest skills based on interests
function suggestSkills(interests) {
    const skillMap = {
        "coding": ["JavaScript", "React", "Node.js", "Python"],
        "design": ["Figma", "Adobe XD", "UI Design", "Graphic Design"],
        "math": ["Algebra", "Calculus", "Statistics"],
        "writing": ["Content Writing", "Blogging", "Copywriting"],
        "business": ["Marketing", "Sales", "Management"]
    };

    let suggestions = [];
    for (let interest of interests) {
        let interestLower = interest.toLowerCase();
        for (let [key, skills] of Object.entries(skillMap)) {
            if (interestLower.includes(key)) {
                suggestions.push(...skills);
            }
        }
    }
    return [...new Set(suggestions)].slice(0, 5);
}

// AI: Generate insights for dashboard
function generateAIInsights(user) {
    const insights = [];

    if (user.totalHelpGiven === 0) {
        insights.push("💡 Start helping others to build your reputation!");
    } else if (user.totalHelpGiven > 10) {
        insights.push("🏆 Amazing! You're a top contributor in the community.");
    }

    if (user.trustScore > 80) {
        insights.push("⭐ Your trust score is excellent! Keep up the great work.");
    } else if (user.trustScore < 50) {
        insights.push("📈 Complete more requests to improve your trust score.");
    }

    if (user.totalHelpReceived > 5) {
        insights.push("🙏 Thank you for being an active community member!");
    }

    insights.push("🎯 Check out new requests matching your skills!");

    return insights;
}

module.exports = {
    autoCategorize,
    suggestTags,
    detectUrgency,
    suggestSkills,
    generateAIInsights
};