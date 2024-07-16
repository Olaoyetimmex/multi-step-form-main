document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("multiStepForm");
  const steps = Array.from(form.querySelectorAll(".form-step"));
  const nextBtns = Array.from(form.querySelectorAll(".next-step"));
  const prevBtns = Array.from(form.querySelectorAll(".prev-step"));
  const stepIndicators = Array.from(
    document.querySelectorAll(".sidebar .step")
  );
  const billingToggle = document.getElementById("billing-toggle");
  let currentStep = 0;

  const prices = {
    arcade: { monthly: 9, yearly: 90 },
    advanced: { monthly: 12, yearly: 120 },
    pro: { monthly: 15, yearly: 150 },
  };

  const addOns = {
    yearly: [
      {
        id: "online-service",
        desc: "Online service",
        details: "Access to multiplayer games",
        price: 10,
      },
      {
        id: "larger-storage",
        desc: "Larger storage",
        details: "Extra 1TB of cloud save",
        price: 20,
      },
      {
        id: "customizable-profile",
        desc: "Customizable profile",
        details: "Custom theme on your profile",
        price: 20,
      },
    ],
    monthly: [
      {
        id: "online-service",
        desc: "Online service",
        details: "Access to multiplayer games",
        price: 1,
      },
      {
        id: "larger-storage",
        desc: "Larger storage",
        details: "Extra 1TB of cloud save",
        price: 2,
      },
      {
        id: "customizable-profile",
        desc: "Customizable profile",
        details: "Custom theme on your profile",
        price: 2,
      },
    ],
  };

  let selectedPlan = null;
  let selectedAddons = [];

  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });
    stepIndicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentStep);
      const circle = indicator.querySelector(".circle");
      if (index === currentStep) {
        circle.style.backgroundColor = "#BFE2FD";
        circle.style.color = "#000";
      } else {
        circle.style.backgroundColor = "transparent";
        circle.style.color = "#fff";
      }
    });
  }

  function validateStep(stepIndex) {
    const inputs = steps[stepIndex].querySelectorAll("input[required]");
    let valid = true;

    inputs.forEach((input) => {
      const errorMessage = input.nextElementSibling;
      if (!input.checkValidity()) {
        valid = false;
        input.classList.add("invalid");
        errorMessage.textContent = input.validationMessage;
        errorMessage.style.display = "block";
      } else {
        input.classList.remove("invalid");
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
      }
    });

    return valid;
  }

  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        if (currentStep === 1) {
          selectedPlan = document.querySelector(".plan.active")?.dataset.plan;
        } else if (currentStep === 2) {
          selectedAddons = Array.from(
            document.querySelectorAll('input[name="addons"]:checked')
          ).map((addon) => addon.id);
        }

        if (currentStep < steps.length - 1) {
          currentStep++;
          updateSteps();
          updateSummary();
        }
      }
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        updateSteps();
        updateSummary();
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateStep(currentStep)) {
      updateSummary();
      alert("Form submitted!");
    }
  });

  function updatePrices() {
    const isYearly = billingToggle.checked;
    document.querySelectorAll(".plan").forEach((plan) => {
      const planType = plan.dataset.plan;
      const priceElement = plan.querySelector("p");
      const freeTextElement = plan.querySelector(".two-months-free");

      if (isYearly) {
        priceElement.textContent = `$${prices[planType].yearly}/yr`;
        freeTextElement.style.display = "block";
      } else {
        priceElement.textContent = `$${prices[planType].monthly}/mo`;
        freeTextElement.style.display = "none";
      }
    });
  }

  function updateAddons() {
    const isYearly = billingToggle.checked;
    const addonsContainer = document.getElementById("addons-container");
    addonsContainer.innerHTML = "";

    const selectedAddonsList = isYearly ? addOns.yearly : addOns.monthly;

    selectedAddonsList.forEach((addon) => {
      const addonDiv = document.createElement("div");
      addonDiv.classList.add("addon");
      addonDiv.innerHTML = `
                <input type="checkbox" id="${addon.id}" name="addons" />
                <label for="${addon.id}">
                    <div class="addon-info">
                        <div class="addon-title">${addon.desc}</div>
                        <div class="addon-details">
                            <span class="addon-description">${
                              addon.details
                            }</span>
                            <span class="addon-price">+$${addon.price}/${
        isYearly ? "yr" : "mo"
      }</span>
                        </div>
                    </div>
                </label>
            `;
      addonsContainer.appendChild(addonDiv);
    });
  }

  function updateSummary() {
    const planElement = document.querySelector(".plan.active");
    const plan = planElement ? planElement.dataset.plan : "";
    const billing = billingToggle.checked ? "Yearly" : "Monthly";
    const addons = Array.from(
      document.querySelectorAll('input[name="addons"]:checked')
    ).map((addon) => addon.id);

    const summaryPlanName = document.querySelector(".summary-plan-name");
    const summaryPlanPrice = document.querySelector(".summary-plan-price");
    const summaryAddonsContainer = document.querySelector(
      ".summary-addons-container"
    );
    const summaryTotalLabel = document.querySelector(".summary-total-label");
    const summaryTotalPrice = document.querySelector(".summary-total-price");

    let planCost = plan ? prices[plan][billing.toLowerCase()] : 0;
    summaryPlanName.textContent = `${
      plan.charAt(0).toUpperCase() + plan.slice(1)
    } (${billing})`;
    summaryPlanPrice.textContent = `$${planCost}/${
      billing === "Yearly" ? "yr" : "mo"
    }`;

    summaryAddonsContainer.innerHTML = "";
    let addonsCost = 0;
    addons.forEach((addonId) => {
      const addonList = billing === "Yearly" ? addOns.yearly : addOns.monthly;
      const addon = addonList.find((a) => a.id === addonId);
      addonsCost += addon.price;

      const addonDiv = document.createElement("div");
      addonDiv.classList.add("summary-addon");
      addonDiv.innerHTML = `
                <span class="summary-addon-name">${addon.desc}</span>
                <span class="summary-addon-price">+$${addon.price}/${
        billing === "Yearly" ? "yr" : "mo"
      }</span>
            `;
      summaryAddonsContainer.appendChild(addonDiv);
    });

    let totalCost = planCost + addonsCost;
    summaryTotalLabel.textContent = `Total per ${
      billing === "Yearly" ? "year" : "month"
    }:`;
    summaryTotalPrice.textContent = `$${totalCost}/${
      billing === "Yearly" ? "yr" : "mo"
    }`;
  }

  billingToggle.addEventListener("change", function () {
    plans.forEach((plan) => {
      plan.classList.remove("active");
    });
    updatePrices();
    updateAddons();
    updateSummary();
  });

  const plans = document.querySelectorAll(".plans .plan");

  plans.forEach((plan) => {
    plan.addEventListener("click", () => {
      plans.forEach((p) => p.classList.remove("active"));
      plan.classList.add("active");
      updateSummary();
    });
  });

  updatePrices();
  updateAddons();
  updateSummary();
});
document
  .getElementById("confirm-button")
  .addEventListener("click", function (e) {
    e.preventDefault();

    // Hide the form container
    document.querySelector(".form-container").style.display = "none";

    // Show the thank you step
    document.getElementById("thank-you-step").style.display = "flex";
  });
