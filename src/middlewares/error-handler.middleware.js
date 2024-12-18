const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    return res.status(409).json({
      message: `La valeur '${value}' pour '${field}' est déjà utilisée.`,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur",
  });
};

export default errorHandler;
