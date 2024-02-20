import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Cliente } from "../entities/Cliente";
import { authAdmin, generateToken } from "../middlewares";
import { loggerDelete, loggerUpdate } from "../config/logger";
import cliente from "../routes/cliente";
import { info, error, warm } from "../postMongo";

class ClienteController {
  

  public async putCliente(req: Request, res: Response): Promise<Response> {
    const infoLog =  await info()
    const warmLog = await warm()
    try {
      const createCliente = req.body;
      const idCliente: any = req.params.uuid;
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const findCliente = await clienteRepository.findOneBy({ id: idCliente });
      if (!findCliente) {
        warmLog.insertOne({
          date: new Date(),
          message: "Cliente não encontrado"
        })
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      loggerUpdate.info(`Cliente atualizado: ID ${idCliente}`);
      
      if (createCliente.nome === undefined || createCliente.email === undefined || createCliente.sexo === undefined || createCliente.telefone === undefined || createCliente.endereco === undefined ) {
        warmLog.insertOne({
          date: new Date(),
          message: 'Erro ao atualizar cliente: ' + "Dados invalidos!"
        })
        return res.status(405).json({erro: "Dados invalidos!"})
      }
      findCliente.imagem = createCliente.imagem;
    
     

      // Salve as alterações no cliente
      const updatedCliente = await clienteRepository.save(findCliente);

      infoLog.insertOne({
        date: new Date(),
        message: "Cliente atualizado",
        idUser: updatedCliente.id
      })
      return res.json(updatedCliente);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      warmLog.insertOne({
        date: new Date(),
        message: 'Erro ao atualizar cliente: ' + error
      })

      return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }


  
  public async getCliente(req: Request, res: Response): Promise<Response> {
    const infoLog =  await info()
    const warmLog = await warm()
    try {
      const idCliente: any = req.params.uuid;
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const cliente = await clienteRepository.findOneBy({ id: idCliente });

      if (!cliente) {
        warmLog.insertOne({
          date: new Date(),
          message: 'Cliente não encontrado'
        })
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      const { imagem } = cliente;

      const clienteData = {
        id: idCliente,
       imagem
      };
      infoLog.insertOne({
        date: new Date(),
        message: "Clientes pego com sucesso",
        id: idCliente
      })
      return res.json(clienteData);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      warmLog.insertOne({
        date: new Date(),
        message: 'Erro ao buscar cliente: ' + error
      })
      return res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  }
  public async postCliente(req: Request, res: Response): Promise<Response> {
    const infoLog =  await info()
    const warmLog = await warm()
    try{
      const createCliente = req.body
      const clienteRepository = AppDataSource.getRepository(Cliente)
      const insertCliente = new Cliente();
      insertCliente.imagem = createCliente.imagem
    
  
  
      const allCliente = await clienteRepository.save(insertCliente)
      infoLog.insertOne({
        date: new Date(),
        message: "Clientes cadastrado com sucesso",
        id: allCliente.id
      })
      return res.json(allCliente)
    }catch(err){
      warmLog.insertOne({
        date: new Date(),
        message: 'Erro ao cadastrar cliente: ' + err
      })
      return res.status(400).json({error: err})
    }
  }

  // public async putCliente(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const createCliente = req.body;
  //     const idCliente: any = req.params.uuid;
  //     const clienteRepository = AppDataSource.getRepository(Cliente);
  //     const findCliente = await clienteRepository.findOne(idCliente);

  //     if (!findCliente) {
  //       return res.status(404).json({ error: 'Cliente não encontrado' });
  //     }

  //     findCliente.nome = createCliente.nome;
  //     findCliente.sexo = createCliente.sexo;
  //     findCliente.telefone = createCliente.telefone;

  //     const updatedCliente = await clienteRepository.save(findCliente);

  //     return res.json(updatedCliente);
  //   } catch (error) {
  //     console.error('Erro ao atualizar cliente:', error);
  //     return res.status(500).json({ error: 'Erro ao atualizar cliente' });
  //   }
  // }



  public async deleteCliente(req: Request, res: Response): Promise<Response> {
    const infoLog =  await info()
    const warmLog = await warm()
    try{
      const userId: any = req.params.uuid
      const clienteRepository = AppDataSource.getRepository(Cliente)
      const findCliente = await clienteRepository.findOneBy({ id: userId })
      const allCliente = await clienteRepository.remove(findCliente)
      loggerDelete.info(`id: ${userId}`)
      infoLog.insertOne({
        date: new Date(),
        message: "Clientes deletado",
        id: userId
      })
      return res.json(allCliente)
    }catch(err){
      warmLog.insertOne({
        date: new Date(),
        message: 'Erro ao deletar cliente: ' + err
      })
      return res.status(400).json(err)
    }
  }

}
export default new ClienteController();