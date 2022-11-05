elementButton = document.querySelector('button#calculate_button');
elementButton.addEventListener("click", calculate)


window.addEventListener('DOMContentLoaded', teste)


//Pegar todas as tags, e inclui em um objeto para ficar facil de puxar com objeto.Id_da_tag ou objeto['id_da_tag']
function getAll(tag){
    let all = document.querySelectorAll(tag); //Pega todos os Inputs
    let numberOfItems = Object.keys(all).length //Conta quantos inputs existem
    objects = new Object //declara novo objeto para os inputs
    for (let i=0;i<numberOfItems;i++) {
        let key = all[i].id //key é igual ao valor do id no allInputs (<input id="id_do_campo">)
        let value = all[i] //value é igual ao valor preenchido no campo input
        objects[[key]] = value //Para cara input, adiciona a chave key : value dentro do Objeto Inputs
    }
    return objects
}

function getAllInputs(){
    let all = document.querySelectorAll('input') //Pega todos os Inputs
    let numberOfItems = Object.keys(all).length //Conta quantos inputs existem
    objects = new Object //declara novo objeto para os inputs
    for (let i=0;i<numberOfItems;i++) {
        let key = all[i].id //key é igual ao valor do id no allInputs (<input id="id_do_campo">)
        let value = all[i].value //value é igual ao valor preenchido no campo input
        objects[[key]] = value //Para cara input, adiciona a chave key : value dentro do Objeto Inputs
    }
    return objects
}

//Calcular quantidade de fotos
function calculateTotalOfPhotos(){
    return printResTotalOfPhotos = allInputs.product_quantity*allInputs.photos_per_product;
}

//Calcular faturamento atual
function calculateCurrentRevenue(){
        let printResCurrentRevenue = allInputs.selling_price*allInputs.selling_number*allInputs.months;
        return printResCurrentRevenue;
}

//Calcular Custo no periodo 
function calculateCurrentTotalCost(){
    let currentTotalCost = ((allInputs.product_cost*allInputs.selling_number)+Number(allInputs.fixed_costs))*allInputs.months;
    //console.log(currentTotalCost); //Como ele não aparece no DOM, coloquei ele no Console para visualizar.
    return currentTotalCost;
}

//Calcular numero de vendas após aumento
function calculateResSellingRaise(n){
    printResSellingRaise = allInputs.selling_number*allInputs.months*(allInputs[`raise_studio_${n}`]/100 + 1);
    return printResSellingRaise;
}

//calcular Lucro atual
function calculateCurrentProfit(){
    let printResCurrentProfit = calculateCurrentRevenue() - calculateCurrentTotalCost();
    return printResCurrentProfit;
}

//Calcular Investimento 1
function calculateInv(n){
    let printResInv = calculateTotalOfPhotos() * allInputs[`investing_studio_${n}`];
    return printResInv;
}
//Calcular Faturamento previsto
function calculateResRevenue(n){
    let printResRevenue = calculateResSellingRaise(n)*(allInputs.selling_price);
    return printResRevenue;
}

//Calcular lucro previsto
function calculateResProfit(n){
    let printResProfit = calculateResRevenue(n) - calculateCurrentTotalCost() - calculateInv(n);
    return printResProfit;
}

//Calcular Aumento no lucro
function calculateResProfitRaise(n){
    let printResProfitRaise = ((calculateResProfit(n) / calculateCurrentProfit())-1);
    return printResProfitRaise;
}

//Formatar como porcentagem
function percentage(number){
    return Intl.NumberFormat('pt-BR', {style: 'percent', maximumFractionDigits:2}).format(number);
};

//Formatar como Dinheiro em Reais
function currencyBR(number){
    return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits:2}).format(number);
};

//Formatar como numero BR
function numberBR(number){
    return Intl.NumberFormat('pt-BR', {style:'decimal', maximumFractionDigits:2}).format(number);
};

//Função para validar formulários, e retornar a mensagem de erro adequada.
function validateForm(){
       
    let allInputs = document.querySelectorAll('input')
    let isBlank = false; //Variavel que determina de está blank
    let isNegative = false; //Variável que determina se tem número negativo
    let isZero = false; //Variável que determina se tem número zero
    let isProfitNegative = false; //Variável que determina se o lucro atual é negativo
    let errorMessage = ""; //No inicio da validação Zera a Mensagem de Erro. Se houver erro depois, é adicionado o erro no final dessa function
   
   allInputs.forEach((input) => {
        console.log('input', input.id)
        input.style.backgroundColor = '#edffed'; // //No inicio do calculo zera o style de cada input para verde, e aí nas próximas validações, elas mudam para vermelho se houver algum problema.
        if (input.classList.contains('no_blank') && !input.value) {//Se tem a class no_blank e está vazio
            input.style.backgroundColor = '#FFCCCC';
            isBlank = true;
            console.log('Em branco',isBlank)
        }
        else if(input.value < 0){ //Se for negativo (Nenhum pode ser negativo, então não precisa procurar pela classe)
            isNegative = true;
            input.style.backgroundColor = '#FFCCCC';
            console.log('Negativo',isNegative)
        }else if (input.classList.contains('no_zero') && input.value == 0){ //Se tem a class no_zero e é Zero
            isZero = true;
            input.style.backgroundColor = '#FFCCCC';
            console.log('Zero',isZero)            
        }
    })
    if(calculateCurrentProfit() < 0 && !isBlank && !isNegative && !isZero){ //Se o Lucro atual é negativo
        isProfitNegative = true;
        console.log('Negative Profit',isProfitNegative,calculateCurrentProfit())
    }
    if(isProfitNegative) errorMessage += `Seu lucro atual está negativo? (${currencyBR(calculateCurrentProfit())})<br/> Confira se preencheu os campos direitinho...<br/> Sem um lucro positivo não é possível calcular o aumento no lucro. <br/>`
    if(isBlank) errorMessage += "Os campos não podem estar vazios! <br/>";
    if(isZero) errorMessage += "Os valores inseridos não podem ser Zero! <br/>";
    if(isNegative) errorMessage += "Os valores inseridos não podem ser Negativos!";
    return errorMessage;
}

//Função principal OnClick, para validar e fazer todos os calculos.
function calculate(){
    allInputs = getAllInputs(); //Pega todos os inputs
    allDivs = getAll('div#error_message, div.result, div.results'); //pega todos os divs importantes

    //Para cada div reseta o valor do resultado
    for(let i in allDivs){ 
        if (allDivs[i].classList.contains('result')) {//Se é uma div com a class result (todas onde eu exibo o resultado)
            allDivs[i].innerHTML = '';
        }
    }

    //Se existe mensagem de erro
    let isFormValid = validateForm()
    if (isFormValid != ""){
        allDivs['error_message'].innerHTML = isFormValid; //exibe a mensagem de erro na <div id="error_message>"
        allDivs['error_message'].classList.value = 'class_error_message'; //Muda a class para exibir a mensagem de erro.

        allDivs['results_studio_1'].classList.remove('lower_profit','bigger_profit'); //Reseta as classes dos blocos de cada estúdio 
        allDivs['results_studio_2'].classList.remove('lower_profit','bigger_profit'); //
    }
    else{

        allDivs['error_message'].classList.value = 'none'; //Muda a Class para None, para esconder as mensagens de erro.

        //Executa os cauculos //////////////////////////
        allDivs['total_quantity_images'].innerHTML = numberBR(calculateTotalOfPhotos());
        allDivs['current_revenue'].innerHTML = currencyBR(calculateCurrentRevenue())
        allDivs['current_profit'].innerHTML = currencyBR(calculateCurrentProfit());
        allDivs['res_total_inv1'].innerHTML = currencyBR(calculateInv(1));
        allDivs['res_total_inv2'].innerHTML = currencyBR(calculateInv(2));
        allDivs['res_revenue1'].innerHTML = currencyBR(calculateResRevenue(1))
        allDivs['res_revenue2'].innerHTML = currencyBR(calculateResRevenue(2))
        allDivs['res_profit1'].innerHTML = currencyBR(calculateResProfit(1))
        allDivs['res_profit2'].innerHTML = currencyBR(calculateResProfit(2))
        allDivs['res_profit_raise1'].innerHTML = percentage(calculateResProfitRaise(1))
        allDivs['res_profit_raise2'].innerHTML = percentage(calculateResProfitRaise(2))
        //////////////---------------------------------------

        //Formata os valores comparando os lucros por estúdio/////////////////////

        allDivs['results_studio_1'].classList.remove('lower_profit','bigger_profit'); //Reseta as classes dos blocos de cada estúdio 
        allDivs['results_studio_2'].classList.remove('lower_profit','bigger_profit'); //

        if ((calculateResProfit(1) == calculateResProfit(2))){
            //Se os lucros forem iguais não fazer nada
        }
        else if (calculateResProfit(1) > calculateResProfit(2)){ //Se um maior que o outro formata o bloco.
            allDivs['results_studio_1'].classList.add('bigger_profit');
            allDivs['results_studio_2'].classList.add('lower_profit');
        }else{
            allDivs['results_studio_1'].classList.add('lower_profit');
            allDivs['results_studio_2'].classList.add('bigger_profit');
        }
        ///////////------------------------------------------
    }     
    
}
