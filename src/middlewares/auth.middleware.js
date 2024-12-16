import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/token.utils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Non autorisé. Token manquant." });
  }

  console.log("Token présent :", token);
  console.log("Utilisateur décodé :", req.user);

  try {
    const decoded = verifyJWT(token);
    req.user = { userID: decoded.userID, role: decoded.role };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Non autorisé. Token invalide." });
  }
};

export default authenticateUser;
