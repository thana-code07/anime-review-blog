const ARTICLES_KEY = "adminArticles";

// allowed article status options
export const ARTICLE_STATUSES = ["Published", "Draft"];

const SEED_ARTICLES = [
  {
    id: "1",
    title:
      "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do",
    category: "Cat",
    status: "Published",
    image: null,
    author: "Thompson P.",
    description:
      "Cats are fascinating creatures with unique behaviors that often leave their owners puzzled.",
    content:
      "Cats communicate through a complex language of meows, purrs, and body language. Understanding these signals helps strengthen the bond between you and your feline friend.",
    date: "2024-09-11T00:00:00.000Z",
  },
  {
    id: "2",
    title: "The Fascinating World of Cats: Why We Love Our Furry Friends",
    category: "Cat",
    status: "Published",
    image: null,
    author: "Thompson P.",
    description:
      "Discover why cats have captured human hearts for thousands of years.",
    content:
      "1. Independent Yet Affectionate\nCats balance independence with deep affection for their humans.\n\n2. Playful Personalities\nTheir curiosity and playfulness make every day entertaining.",
    date: "2024-09-10T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Finding Strength in Adversity: Stories of Resilience",
    category: "Inspiration",
    status: "Published",
    image: null,
    author: "Thompson P.",
    description:
      "Real stories of people who turned challenges into growth.",
    content:
      "Resilience is not about avoiding hardship—it is about how we respond when life gets difficult. These stories remind us that strength can be found in the most unexpected places.",
    date: "2024-09-08T00:00:00.000Z",
  },
  {
    id: "4",
    title: "The Science of Happiness: What Makes Us Smile",
    category: "General",
    status: "Published",
    image: null,
    author: "Thompson P.",
    description:
      "A look at the research behind everyday joy and well-being.",
    content:
      "Scientists have studied happiness for decades. Small habits—gratitude, connection, and movement—often matter more than big milestones.",
    date: "2024-09-05T00:00:00.000Z",
  },
  {
    id: "5",
    title: "Exploring the Unknown: Adventures in Everyday Life",
    category: "General",
    status: "Draft",
    image: null,
    author: "Thompson P.",
    description:
      "How to find adventure without leaving your neighborhood.",
    content:
      "Adventure does not always require a passport. Trying a new café, walking a different route, or learning a skill can open new worlds close to home.",
    date: "2024-09-03T00:00:00.000Z",
  },
  {
    id: "6",
    title: "How Cats Communicate: Decoding Meows and Body Language",
    category: "Cat",
    status: "Draft",
    image: null,
    author: "Thompson P.",
    description:
      "A practical guide to reading your cat’s signals.",
    content:
      "From slow blinks to tail flicks, cats share how they feel. Learn the cues that mean “I trust you” versus “give me space.”",
    date: "2024-09-01T00:00:00.000Z",
  },
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  const existing = readJson(ARTICLES_KEY, null);
  if (existing === null) {
    writeJson(ARTICLES_KEY, SEED_ARTICLES);
    return SEED_ARTICLES;
  }
  return existing;
}

// read all admin articles from localStorage
export function getArticles() {
  return ensureSeeded();
}

// read one admin article by id
export function getArticle(id) {
  return getArticles().find((article) => String(article.id) === String(id)) ?? null;
}

function nextId(articles) {
  const maxId = articles.reduce((max, article) => {
    const numeric = Number(article.id);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);
  return String(maxId + 1);
}

// create a new admin article in localStorage
export function createArticle(data) {
  const articles = getArticles();
  const article = {
    id: nextId(articles),
    title: data.title?.trim() ?? "",
    category: data.category ?? "",
    status: data.status === "Published" ? "Published" : "Draft",
    image: data.image ?? null,
    author: data.author?.trim() ?? "",
    description: data.description?.trim() ?? "",
    content: data.content?.trim() ?? "",
    date: new Date().toISOString(),
  };
  writeJson(ARTICLES_KEY, [article, ...articles]);
  return article;
}

// update an existing admin article in localStorage
export function updateArticle(id, data) {
  const articles = getArticles();
  const index = articles.findIndex(
    (article) => String(article.id) === String(id),
  );
  if (index === -1) {
    return null;
  }

  const updated = {
    ...articles[index],
    title: data.title?.trim() ?? articles[index].title,
    category: data.category ?? articles[index].category,
    status:
      data.status === "Published"
        ? "Published"
        : data.status === "Draft"
          ? "Draft"
          : articles[index].status,
    image: data.image !== undefined ? data.image : articles[index].image,
    author: data.author?.trim() ?? articles[index].author,
    description:
      data.description !== undefined
        ? data.description.trim()
        : articles[index].description,
    content:
      data.content !== undefined
        ? data.content.trim()
        : articles[index].content,
  };

  const next = [...articles];
  next[index] = updated;
  writeJson(ARTICLES_KEY, next);
  return updated;
}

// delete an admin article from localStorage
export function deleteArticle(id) {
  const articles = getArticles();
  const next = articles.filter(
    (article) => String(article.id) !== String(id),
  );
  if (next.length === articles.length) {
    return false;
  }
  writeJson(ARTICLES_KEY, next);
  return true;
}

// rename category on all articles that use the old name
export function renameArticlesCategory(oldName, newName) {
  const articles = getArticles();
  let changed = false;
  const next = articles.map((article) => {
    if (article.category === oldName) {
      changed = true;
      return { ...article, category: newName };
    }
    return article;
  });
  if (changed) {
    writeJson(ARTICLES_KEY, next);
  }
}
