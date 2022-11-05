function getAllInputs(){
    let allInputs = document.querySelectorAll('input')
    let numberOfItens = Object.keys(allInputs).length;
    objects = new Object()
    for(let i=0; i<numberOfItens ; i++){
        let key = allInputs[i].id;
        let value = allInputs[i].value;
        objects[[key]] = value;
        
    }
    return objects;
}

//Declarar as variáveis dos resultados.
let divResTotalQuantityImages = window.document.getElementById('total_quantity_images')
let divResCurrentRevenue = window.document.getElementById('current_revenue')
let divResCurrentProfit = window.document.getElementById('current_profit')
let divResTotalInv1 = window.document.getElementById('res_total_inv1')
let divResTotalInv2 = window.document.getElementById('res_total_inv2')
let divResRevenue1 = window.document.getElementById('res_revenue1')
let divResRevenue2 = window.document.getElementById('res_revenue2')
let divResProfit1 = window.document.getElementById('res_profit1')
let divResProfit2 = window.document.getElementById('res_profit2')
let divResProfitRaise1 = window.document.getElementById('res_profit_raise1')
let divResProfitRaise2 = window.document.getElementById('res_profit_raise2')
let divErrorMessage = window.document.getElementById('error_message')
let divResStudio1 = window.document.getElementById('results_studio_1')
let divResStudio2 = window.document.getElementById('results_studio_2')

//Calcular quantidade de fotos
function calculateTotalOfPhotos(){
    let printResTotalOfPhotos = allInputs['product_quantity']*allInputs['photos_per_product'];
    return printResTotalOfPhotos;
}

//Calcular faturamento atual
function calculateCurrentRevenue(){
    let printResCurrentRevenue = allInputs['selling_price']*allInputs['selling_number']*allInputs['months'];
    return printResCurrentRevenue;
}

//Calcular Custo no periodo 
function calculateCurrentTotalCost(){
    let currentTotalCost = ((allInputs['product_cost']*allInputs['selling_number']+Number(allInputs['fixed_costs']))*allInputs['months']);
    //console.log(currentTotalCost); //Como ele não aparece no DOM, coloquei ele no Console para visualizar.
    return Number(currentTotalCost);
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
    let printResRevenue = calculateCurrentRevenue()*(allInputs[`raise_studio_${n}`]/100+1);
    return printResRevenue;
}

//Calcular lucro previsto
function calculateResProfit(n){
    let printResProfit1 = calculateResRevenue(n) - calculateCurrentTotalCost() - calculateInv(n);
    return printResProfit1;
}

//Calcular Aumento no lucro 1
function calculateResProfitRaise(n){
    let printResProfitRaise = (calculateResProfit(n) / calculateCurrentProfit())-1;
    return printResProfitRaise;
}

function currencyBR(number){
    return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits:2}).format(number); 
}

function percentage(number){
    return Intl.NumberFormat('pt-BR', {style: 'percent', maximumFractionDigits:2}).format(number); 
}

function numberBR(number){
    return Intl.NumberFormat('pt-BR', {style: 'decimal', maximumFractionDigits:2}).format(number); 
}

function validateForm(){
    let allInputs = document.querySelectorAll('input')
    let errorMessage = ""
    let isBlank = false
    let isZero = false
    let isNegative = false
    let isProfitNegative = false
    allInputs.forEach((input) => {
        input.style.backgroundColor = '#FFF' //Zera o Style
        if(input.classList.contains('no_blank') && input.value == ""){
            isBlank = true
            input.style.backgroundColor = '#FCC'
        }else if(input.classList.contains('no_zero') && input.value == 0){
            isZero = true
            input.style.backgroundColor = '#FCC'
        }
        else if(input.value < 0){
            isNegative = true
            input.style.backgroundColor = '#FCC'
        }
    })
    if(calculateCurrentProfit() < 0){
        isProfitNegative = true
    }


    if(isProfitNegative && !isBlank && !isNegative && !isZero) errorMessage = `Seu lucro está negativo? (${currencyBR(calculateCurrentProfit())}) <br\> Verifique os valores preenchidos`
    
    if(isBlank) errorMessage += "Os campos não podem estar vazios<br/>"
    if(isZero) errorMessage += "Os campos não podem ser Zero<br/>"
    if(isNegative) errorMessage += "Os campos não podem ser negativos"  
    console.log(errorMessage)
    return errorMessage;
}



//Criar function Caucular
function Calculate(){

    allDivs = document.querySelectorAll('div')
    allDivs.forEach((div) => {
        if(div.classList.contains('result')){
            div.innerHTML = ''
        }
    })

    allInputs = getAllInputs() //ignorem por enquanto

    let isValid = validateForm();

    if(isValid != ""){
        divErrorMessage.innerHTML = isValid
        divErrorMessage.classList.value = "class_error_message"
    }else{
    divErrorMessage.classList.value = "none"
    divResTotalQuantityImages.innerHTML = calculateTotalOfPhotos()
    divResCurrentRevenue.innerHTML = currencyBR(calculateCurrentRevenue())
    divResCurrentProfit.innerHTML =  currencyBR(calculateCurrentProfit())
    divResTotalInv1.innerHTML = currencyBR(calculateInv(1))
    divResTotalInv2.innerHTML = currencyBR(calculateInv(2))
    divResRevenue1.innerHTML = currencyBR(calculateResRevenue(1))
    divResRevenue2.innerHTML = currencyBR(calculateResRevenue(2))
    divResProfit1.innerHTML =  currencyBR(calculateResProfit(1))
    divResProfit2.innerHTML = currencyBR(calculateResProfit(2))
    divResProfitRaise1.innerHTML = percentage(calculateResProfitRaise(1))
    divResProfitRaise2.innerHTML = percentage(calculateResProfitRaise(2))
    }

    //Resetar classes
    divResStudio1.classList.remove('bigger_profit', 'lower_profit')
    divResStudio2.classList.remove('bigger_profit', 'lower_profit')
    if(calculateResProfitRaise(1) > calculateResProfitRaise(2))
    {
        divResStudio1.classList.add('bigger_profit')
        divResStudio2.classList.add('lower_profit')
    } else if(calculateResProfitRaise(1) == calculateResProfitRaise(2)){
        //Nada acontece
    }
    else{
        divResStudio2.classList.add('bigger_profit')
        divResStudio1.classList.add('lower_profit')
    }

}