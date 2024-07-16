const menu = () => {
    return `
        <nav style= 'font-size: 20px;'>
            <a href="/" style='padding-right: 10px;'>Home</a>
            <a href="/listaroperacoes" style='padding-right: 10px;'>Lista de Operações</a>
            <a href="/add_product" style='padding-right: 10px;'>Criar Produtos</a>
            <a href="/remove_product" style='padding-right: 10px;'>Remover Produtos</a>
            <a href="/updateproduct" style='padding-right: 10px;'>Atualizar Produtos</a>
        </nav>
    `
};

const backMenu = (route, op) => {
    return `
        <a style="font-size:20px", href=${route}>Back to ${op} Product</a>
    `
};

module.exports = {
    menu,
    backMenu,
  };