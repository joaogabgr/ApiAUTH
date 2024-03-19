import User from "../entities/User";
import { AppDataSource } from "../../database/data-source";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

async function emailExists(email: string): Promise<boolean> {
  try {
    const user = await userRepository.findOneBy({ email: email });
    console.log(!!user);
    return !user;
  } catch (error) {
    console.error(error);
    throw { code: 500, message: "Erro interno do servidor" };
  }
}

export async function insertUser(
  name: string,
  email: string,
  password: string,
  passwordConf: string
): Promise<User> {
  try {
    if (password !== passwordConf) {
      throw { code: 400, message: "As senhas não são iguais" };
    }

    const verify = await emailExists(email)
    if (!verify) {
      throw { code: 400, message: "Este email já está em uso" };
    }
    
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User(name, email, hashPassword);

    await userRepository.save(user);
    console.log("Usuário salvo com sucesso");
    return user;
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
    throw error;
  }
}


export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const user = await userRepository.findOneBy({ email: email });
    if (!user) {
      throw { code: 400, message: "Usuario não encontrado" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw { code: 400, message: "Senha invalida" };
    }

    const token = jwt.sign({ userID: user.id }, "secret", { expiresIn: "1h" });

    console.log("Usuario logado com sucesso");
    return user
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    const user = await userRepository.findOneBy({ id: id });

    if (!user) {
      throw { code: 404, message: "Usuario inexistente" };
    }

    await userRepository.remove(user);
    console.log("Excluido com sucesso");
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw error;
  }
}
