import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Posts = db.define('Posts',
    {
        postImg: { type: DataTypes.STRING, allowNull: true },
        postMsg: { type: DataTypes.STRING, allowNull: false }
    }
);

export default Posts;