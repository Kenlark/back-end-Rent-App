const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Gestion des erreurs de validation Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: "Validation échouée.", errors });
  }

  // Autres erreurs générales
  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur",
    details: err.stack,
  });
};

export default errorHandler;
