const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Nous allons utiliser les variables d'environnement du fichier .env

const secretKey = process.env.SECRET_KEY;

function generateToken(user) {
  return jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" }); // Nous générons un token qui expirera dans 1 heure
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Récupérer le header de l'autorisation
  const token = authHeader && authHeader.split(" ")[1]; // Nous récupérons le token dans le header de la requête
  if (!token) return res.status(403).send("Missing token"); // si le token n'est pas présent on renvoie une erreur 403

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token"); // si le token est invalide on renvoie une erreur 401
    }
    req.user = decoded; // on ajoute le user à la requête
    next(); // on appelle le middleware suivant
  });
}

module.exports = { generateToken, verifyToken };
