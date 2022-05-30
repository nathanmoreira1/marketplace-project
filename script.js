/* Fazer os itens aparecerem na tela */
let modal_quantidade = 1;
let carrinho = [];
let ModalKey = 0;


/* Listagem dos Itens */
itensJson.map((item,index)=>{
    let marketplace_item = document.querySelector('.models .item-field').cloneNode(true);

    /* Preencher as informações dos itens */
    document.querySelector('.item-area').append(marketplace_item)
    
    marketplace_item.setAttribute('data-key',index)
    marketplace_item.querySelector('.item-img img').src = item.img
    marketplace_item.querySelector('.item-price').innerHTML = `R$ ${parseFloat(item.price).toFixed(2)}`;
    marketplace_item.querySelector('.item-name').innerHTML = item.name;
    marketplace_item.querySelector('.item-desc').innerHTML = item.description;

    marketplace_item.querySelector('a').addEventListener("click",(e)=>{
        /* Fazer com que a tela não seja atualizada após adicionar um novo item ao carrinho */
        e.preventDefault();

        /* Fazer com que quando um item seja selecionado, a interface de adição de um novo item seja aberta */
        document.querySelector('.ItemWindowArea').style.opacity = 0;
        document.querySelector('.ItemWindowArea').style.display = 'flex';
        setTimeout(()=>{
            document.querySelector('.ItemWindowArea').style.opacity = 1;
        },200)

        /* Armazenar a identificação do item clicado numa variável */
        let key = e.target.closest('.item-field').getAttribute('data-key');

        /* Preenchimento da iterface de adição de um novo item */
        document.querySelector('.itemInfo h1').innerHTML = itensJson[key].name;
        document.querySelector('.itemInfo--desc').innerHTML = itensJson[key].description;
        document.querySelector('.itemBig img').src = itensJson[key].img;
        document.querySelector('.itemInfo--actualPrice').innerHTML = `R$${parseFloat(itensJson[key].price).toFixed(2)}`;

        /* Resetar a quantidade de itens */
        document.querySelector('.itemInfo--qt').innerHTML = 1;
        modal_quantidade = 1;

        /* Identificar qual item em questão para uso posterior */
        ModalKey = key;
    });
});

/* Eventos do Modal */
closeModal = () => {
    document.querySelector('.ItemWindowArea').style.opacity = 0;
    setTimeout(function(){
        document.querySelector('.ItemWindowArea').style.display = 'none';
    },200)
}
// Fechar o Modal clicando em "Voltar" ou em "Cancelar"
document.querySelectorAll('.itemInfo--cancelButton , .itemInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener("click", closeModal)
})

// Aumentar ou diminuir a quantidade do item
document.querySelector('.itemInfo--qtmenos').addEventListener("click",()=>{
    if(modal_quantidade>1) {
        modal_quantidade = modal_quantidade - 1
        document.querySelector('.itemInfo--qt').innerHTML = modal_quantidade;
    }
})
document.querySelector('.itemInfo--qtmais').addEventListener("click",()=>{
    modal_quantidade = modal_quantidade + 1
    document.querySelector('.itemInfo--qt').innerHTML = modal_quantidade;
})

/* Eventos do Carrinho de Compras */
document.querySelector('.itemInfo--addButton').addEventListener("click",function(){
 
    // Verificar se no carrinho já possui o item que o usuário quer adicionar e, caso possua, não criar outro objeto mas sim adicionar ao objeto existente 
    let identificador = itensJson[ModalKey].id + '@' + itensJson[ModalKey].name;
    let key = carrinho.findIndex((item)=>item.identificador == identificador);

    if (key > -1) {
        carrinho[key].quantidade += modal_quantidade;
    }
    else {
        carrinho.push({
            identificador,
            id: itensJson[ModalKey].id,
            quantidade: modal_quantidade
        })
    }
    // Atualizar o carrinho
    atualizar_carrinho()

    // Fechar o modal ao concluir de adicionar o item ao carrinho
    closeModal();
})

function atualizar_carrinho() {
    // Atualizar o carrinho do mobile
    document.querySelector('.menu-openner span').innerHTML = carrinho.length;

    if(carrinho.length>0) {
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        let total = 0;

        for(let i in carrinho) {
            let marketplace_item = itensJson.find((item)=>item.id == carrinho[i].id);

            // Atualizar total
            total += marketplace_item.price * carrinho[i].quantidade;

            // Pegando o molde e clonando ele 
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            // Preencher os campos do carrinho com as informações de cada item que foi adicionado
            cartItem.querySelector('img').src = marketplace_item.img
            cartItem.querySelector('.cart--item-nome').innerHTML = marketplace_item.name;
            cartItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade;

            // Dar funcionalidade ao botão de adicionar ou diminuir determinado item diretamente no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener("click",()=>{
                if(carrinho[i].quantidade > 1) {
                    carrinho[i].quantidade--;
                }
                else {
                    carrinho.splice(i,1);
                }
                atualizar_carrinho();
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener("click",()=>{
                carrinho[i].quantidade++;
                atualizar_carrinho();
            })

            // Mostrando o local ao qual quero adicionar esses moldes preenchidos 
            document.querySelector('.cart').append(cartItem);
        }

        // Exibição das informações na tela
        document.querySelector('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    }
    else {
        document.querySelector('aside').classList.remove('show');

        // Para o mobile
        document.querySelector('aside').style.left = '100vw';
    }
}

/* Observações do MOBILE */

// Abrir o carrinho quando apertarmos nele 
document.querySelector('.menu-openner').addEventListener("click", function() {
    if(carrinho.length > 0) {
        document.querySelector('aside').style.left = '0';
    }
})

// Fechar o carrinho quando apertarmos no X 
document.querySelector('.menu-closer').addEventListener("click", function() {
    document.querySelector('aside').style.left = '100vw'
})