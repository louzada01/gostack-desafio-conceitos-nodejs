const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(400).json({
      error: "This repository does not exists.",
    });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex === -1) {
    return response.status(400).json({
      error: "This repository does not exists.",
    });
  }

  repositories.splice(findRepositoryIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepository = repositories.find(
    repository => repository.id === id
  );

  if (!findRepository) {
    return response.status(400).json({
      error: "This repository does not exists.",
    });
  }

  findRepository.likes += 1;

  return response.status(200).json(findRepository);
});

app.put("/repositories/:id/dislike", (request, response) => {
  const { id } = request.params;

  const findRepository = repositories.find(
    repository => repository.id === id
  );

  if (!findRepository) {
    return response.status(400).json({
      error: "This repository does not exists.",
    });
  }

  findRepository.likes -= 1;

  return response.status(200).json(findRepository);
})

module.exports = app;
