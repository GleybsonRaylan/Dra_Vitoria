document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-contato');
    
    if (form) {
        form.addEventListener('submit', enviarParaWhatsApp);
    }
});

function enviarParaWhatsApp(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const servico = document.getElementById('servico').value;
    const mensagem = document.getElementById('mensagem').value;
    
    // Validar campos
    if (!validarTelefone(telefone)) {
        mostrarErro('telefone', 'Por favor, insira um número de WhatsApp válido com DDD');
        return;
    }
    
    if (!nome || !servico || !mensagem) {
        mostrarErroGeral('Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    // Formatando o número de telefone
    const numeroWhatsApp = '5581995125671'; // Seu número com código do país e DDD
    
    // Criar mensagem formatada
    const texto = `*Nova mensagem do site - Dra. Vitória Santos*\n\n` +
                 `*Nome:* ${nome}\n` +
                 `*Telefone:* ${telefone}\n` +
                 `*Serviço de interesse:* ${document.getElementById('servico').options[document.getElementById('servico').selectedIndex].text}\n` +
                 `*Mensagem:* ${mensagem}`;
    
    // Codificar a mensagem para URL
    const textoCodificado = encodeURIComponent(texto);
    
    // Mostrar confirmação
    mostrarConfirmacao();
    
    // Redirecionar para o WhatsApp após 2 segundos (tempo para usuário ver a mensagem)
    setTimeout(() => {
        window.open(`https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`, '_blank');
        document.getElementById('form-contato').reset();
    }, 2000);
}

function validarTelefone(telefone) {
    // Remove todos os caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');
    // Verifica se tem pelo menos 10 dígitos (DDD + número)
    return numeros.length >= 10;
}

function mostrarErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    campo.classList.add('input-error');
    
    // Remove mensagens de erro existentes
    let errorElement = campo.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        campo.parentNode.insertBefore(errorElement, campo.nextSibling);
    }
    
    errorElement.textContent = mensagem;
    errorElement.style.display = 'block';
}

function mostrarErroGeral(mensagem) {
    alert(mensagem); // Pode ser substituído por um modal de erro mais bonito
}

function mostrarConfirmacao() {
    const elemento = document.getElementById('confirmation-message');
    elemento.classList.add('confirmation-visible');
}

function fecharConfirmacao() {
    const elemento = document.getElementById('confirmation-message');
    elemento.classList.remove('confirmation-visible');
}

// Limpar erros quando o usuário começa a digitar
document.getElementById('telefone').addEventListener('input', function() {
    this.classList.remove('input-error');
    const errorElement = this.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
});