// form.js - Arquivo adicional para funcionalidades do formulário
document.addEventListener("DOMContentLoaded", function () {
  // Máscara para telefone
  const telefoneInput = document.getElementById("telefone");
  if (telefoneInput) {
    telefoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 11) {
        value = value.substring(0, 11);
      }

      // Formatar como (XX) XXXXX-XXXX
      if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      } else if (value.length > 0) {
        value = value.replace(/(\d{0,2})/, "($1");
      }

      e.target.value = value;
    });
  }

  // Validação em tempo real para todos os campos obrigatórios
  const form = document.getElementById("form-contato");
  if (form) {
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateField(this);
      });

      field.addEventListener("input", function () {
        if (this.value.trim() !== "") {
          clearFieldError(this);
        }
      });
    });
  }
});

// Funções de validação específicas
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function formatPhoneNumber(phone) {
  return phone.replace(/\D/g, "");
}

// Feedback visual durante o envio
function setFormLoading(isLoading) {
  const submitBtn = document.querySelector(".btn-submit");
  const originalText = submitBtn.textContent;

  if (isLoading) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
  } else {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Limpar formulário após envio bem-sucedido
function resetForm() {
  const form = document.getElementById("form-contato");
  if (form) {
    form.reset();

    // Limpar erros
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((error) => error.remove());

    const errorInputs = form.querySelectorAll(".input-error");
    errorInputs.forEach((input) => input.classList.remove("input-error"));
  }
}
