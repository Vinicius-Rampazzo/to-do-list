const botaoAdicionar = document.querySelector('#criar-tarefa');
const input = document.querySelector('#texto-tarefa');
const lista = document.getElementById('lista-tarefas');
const botaoApagar = document.querySelector('#apaga-tudo');
const botaoFinalizados = document.querySelector('#remover-finalizados');
const botaoSalvarTarefas = document.querySelector('#salvar-tarefas');
const botaoRemoveSelecionado = document.querySelector('#remover-selecionado');
let filhoDaLista = document.createElement('li');
const classeDoFilhoDaLista = document.querySelector('.list');
// coloquei o .value, pois ele me da o valor do input, e assim consigo manipular o que fica dentro dele.

function mudandoBackground(evento) {
  evento.target.classList.toggle('selected');
}
// o ".toggle" usado acima, serve para variar, por exemplo, como ele está numa função de click, então fica: se eu clicar em um item da lista, aparece a classe "selected", se eu clicar novamente, a classe some, ou seja, se não tiver a classe que coloquei no ".toggle" ele vai criar, porém se ja tiver, ele vai deletar.

function selecionandoComDoisClicks(doisClicks) {
  doisClicks.target.classList.toggle('completed');

  botaoFinalizados.addEventListener('click', interacaoBotaoFinalizados);
}
// acima só precisei fazer a classe "completed" aparecer e desaparecer após os dois clicks, adiciondo no evento que criei dentro da função "interacaoBotaoAdicionar", e mudando algumas coisas no css atravez da classe "completed", ou seja, quando eu dar os dois clicks, se não tiver a classe completed, vai aparecer ao dar os dois clicks, e as alteraçoes feitas no css dentro dessa classe "completed" será ativada certinho de uma vez.

function interacaoBotaoAdicionar() {
  const inputTexto = input.value;
  // ".value" serve aqui para pegar o que tem dentro do input

  filhoDaLista = document.createElement('li');
  filhoDaLista.classList.add('list');
  lista.appendChild(filhoDaLista);

  // acima eu quis dizer que, a cada clique que eu der no "adicionar", vai criar uma tag <li> e dentro dela, pegar o valor com o .value, e atribuir nas listas criadas.
  filhoDaLista.innerText = inputTexto;
  input.value = '';

  // acima eu atribui um valor '' vazio, ou seja, assim que eu clicar no botao "adicionar", além de se juntar na lista o que eu escrevi, também vai substituir o que está escrito no input por uma str vazia.
  filhoDaLista.addEventListener('click', mudandoBackground);
  filhoDaLista.addEventListener('dblclick', selecionandoComDoisClicks);
}
botaoAdicionar.addEventListener('click', interacaoBotaoAdicionar);
// acima, usei o addEventListener para a cada click, ativar a minha função (que está dentro do parenteses).

function interacaoBotaoApagar() {
  const classeLista = document.querySelectorAll('.list');

  if (classeLista) {
    for (let index = 0; index < classeLista.length; index += 1) {
      classeLista[index].remove();
    }
  }
}
botaoApagar.addEventListener('click', interacaoBotaoApagar);
// Acima, fiz o cirei um botao para limpar todas as tags <li> que tiver a classe "list" (que no caso são todas).

function interacaoBotaoFinalizados() {
  const classCompleted = document.querySelectorAll('.completed');

  if (classCompleted) {
    for (let index = 0; index < classCompleted.length; index += 1) {
      classCompleted[index].remove();
    }
  }
}
// Acima eu percorri meu array atravez de uma condição, para que se eu clicar no botão "Remover Finalizados" com o evento criado na função "selecionandoComDoisClicks", remover apenas os itens selecionados com a classe "completed".

function interacaoBotaoRemoverSelecionados() {
  const classSelecionado = document.querySelectorAll('.selected');

  if (classSelecionado) {
    for (let index = 0; index < classSelecionado.length; index += 1) {
      classSelecionado[index].remove();
    }
  }
}
botaoRemoveSelecionado.addEventListener(
  'click',
  interacaoBotaoRemoverSelecionados
);
// aqui eu busquei meu botao com o queryselector la em cima nas constantes, e depois busquei a classe que fiz "selected", para que se tiver a classe selected, eu remover clacando no botao com o addEventListener

function interacaoBotaoSalvarTarefas() {
  const tagLi = document.querySelectorAll('.list');
  const arrayItens = JSON.parse(localStorage.getItem('chaveItensSalvos'));

  if (tagLi) {
    for (let index = 0; index < tagLi.length; index += 1) {
      // console.log(tagLi)
      arrayItens.push(tagLi[index].innerHTML);
      localStorage.setItem('chaveItensSalvos', JSON.stringify(arrayItens));
      // localStorage.setItem('chave', tagLiHTML)
    }
  }
}
botaoSalvarTarefas.addEventListener('click', interacaoBotaoSalvarTarefas);
// fiz um for pra percorrer tudo o que tiver, (percorrer todas as tags li), para conseguir salvar todas.
