import User from "../entities/User";
import { AppDataSource } from "../config/data-source";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

async function emailExists(email: string): Promise<boolean> {
  try {
    const user = await userRepository.findOneBy({ email: email });
    return !user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function cpfExists(cpf: string): Promise<boolean> {
  try {
    const user = await userRepository.findOneBy({ cpf: cpf })
    return !user
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function validadeCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

  if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

export async function insertUser(
  name: string,
  email: string,
  cpf: string,
  password: string,
  passwordConf: string
): Promise<User> {
  try {
    if (password !== passwordConf) {
      throw { code: 500, message: "As senhas não são iguais" };
    }

    const verifyEmail = await emailExists(email);
    if (!verifyEmail) {
      throw { code: 500, message: "Este email já está em uso" };
    }

    const existCpf = await cpfExists(cpf);
    if (!existCpf) {
      throw { code: 500, message: "Esta cpf já está em uso"}
    }

    const verifyCpf = validadeCPF(cpf)
    if (!verifyCpf) {
      throw { code: 500, message: "Este cpf não é valido"}
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User(name, email, cpf, hashPassword);

    await userRepository.save(user);
    console.log("Usuário salvo com sucesso");
    return user;
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const user = await userRepository.findOneBy({ email: email });
    if (!user) {
      throw { code: 500, message: "Usuario não encontrado" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw { code: 400, message: "Senha invalida" };
    }

    const token = jwt.sign({ userID: user.id }, "secret", { expiresIn: "1h" });

    console.log("Usuario logado com sucesso");
    return user;
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
