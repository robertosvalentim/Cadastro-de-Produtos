const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;
    console.log(categoria);
    console.log(usuario);
    try {

        let produtos;
        if (categoria) {
            produtos = await knex('produtos').where('usuario_id', usuario.id).where('categoria', 'ilike', `%${categoria}%`).debug();
        } else {
            produtos = await knex('produtos').where('usuario_id', usuario.id).debug();
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const produto = await knex('produtos').where('usuario_id', usuario.id).where({ id }).debug();

        if (produto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produto[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {
        const produto = {
            nome, estoque, preco, categoria, descricao, imagem, usuario_id: usuario.id
        };
        const produtoCadastrado = await knex('produtos').insert(produto).returning('*').debug();

        if (!produtoCadastrado) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json(produtoCadastrado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const produto = await knex('produtos').where('usuario_id', usuario.id).where({ id });


        if (produto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtualizar = { nome, estoque, preco, categoria, descricao, imagem };
        const produtoAtualizado = await knex('produtos').update(produtoAtualizar).where('id', id)
        if (produtoAtualizado === 0) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where('usuario_id', usuario.id).where({ id });

        if (produto === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produtos').del().where({ id });
        if (produtoExcluido === 0) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}