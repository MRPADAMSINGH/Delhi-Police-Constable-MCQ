function loadMCQ(fileName) {
  fetch(fileName)
    .then(res => res.json())
    .then(data => renderMCQs(data))
    .catch(err => {
      document.getElementById("mcq-container").innerHTML =
        `<p class="text-red-600 text-center">Error loading MCQ file</p>`;
      console.error(err);
    });
}

function renderMCQs(mcqs) {
  const container = document.getElementById("mcq-container");
  container.innerHTML = "";

  mcqs.forEach((q, index) => {

    // Handle explanation (string OR array)
    let explanationText = "";
    if (Array.isArray(q.explanation_step_by_step)) {
      explanationText = q.explanation_step_by_step.join("<br>");
    } else if (q.explanation) {
      explanationText = q.explanation;
    }

    const div = document.createElement("div");
    div.className =
      "mcq bg-white rounded-xl shadow p-4 md:p-6";

    let optionsHTML = "";
    for (let key in q.options) {
      optionsHTML += `
        <div
          class="option border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
          data-option="${key}"
          onclick="checkAnswer(this, '${key}', '${q.correct_answer}')"
        >
          <span class="font-semibold">${key}.</span> ${q.options[key]}
        </div>
      `;
    }

    div.innerHTML = `
      <h3 class="font-semibold text-lg mb-3">
        Q${index + 1}. ${q.question}
      </h3>

      <div class="space-y-2">
        ${optionsHTML}
      </div>

      <div class="answer-box hidden mt-4 border-t pt-3 text-sm space-y-2">
        <p class="correct-text text-green-600 font-semibold"></p>

        ${explanationText
          ? `<p><span class="font-semibold">Explanation:</span><br>${explanationText}</p>`
          : ""
        }

        ${q.trick
          ? `<p class="text-blue-600"><span class="font-semibold">Trick:</span> ${q.trick}</p>`
          : ""
        }

        ${q.exam_tip
          ? `<p class="text-purple-600"><span class="font-semibold">Exam Tip:</span> ${q.exam_tip}</p>`
          : ""
        }
      </div>
    `;

    container.appendChild(div);
  });
}

function checkAnswer(element, selected, correct) {
  const mcqBox = element.closest(".mcq");
  const options = mcqBox.querySelectorAll(".option");
  const answerBox = mcqBox.querySelector(".answer-box");
  const correctText = mcqBox.querySelector(".correct-text");

  // Disable further clicks
  options.forEach(opt => opt.style.pointerEvents = "none");

  // Highlight options
  options.forEach(opt => {
    if (opt.dataset.option === correct) {
      opt.classList.add("bg-green-100", "border-green-500", "text-green-700");
    }
    if (opt.dataset.option === selected && selected !== correct) {
      opt.classList.add("bg-red-100", "border-red-500", "text-red-700");
    }
  });

  // Show correct answer text ALWAYS
  correctText.innerHTML = `✔ Correct Answer: ${correct}`;

  answerBox.classList.remove("hidden");
}


