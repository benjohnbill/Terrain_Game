/* ============================================================
 *  quiz.js — reusable self-check quiz widget (vanilla, zero deps)
 *  Shared across lessons. Markup contract:
 *
 *  <div class="quiz">
 *    <h3>Check yourself</h3>
 *    <div class="quiz-q" data-answer="l1">
 *      <p class="quiz-prompt">Where does <code>JavaScript</code> sit?</p>
 *      <div class="quiz-options">
 *        <button data-v="l1">Language / runtime</button>
 *        <button data-v="l2">Framework</button>
 *        ...
 *      </div>
 *      <div class="quiz-explain">Because ... .</div>
 *    </div>
 *  </div>
 *
 *  Click an option → it locks, marks right/wrong, and reveals the
 *  explanation. A wrong pick stays selectable until the answer is found,
 *  so the feedback loop rewards retrieval, not a single guess.
 * ============================================================ */
(function () {
  function wire(q) {
    var answer = q.getAttribute('data-answer');
    var explain = q.querySelector('.quiz-explain');
    var buttons = Array.prototype.slice.call(q.querySelectorAll('.quiz-options button'));
    var solved = false;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (solved) return;
        var correct = btn.getAttribute('data-v') === answer;
        if (correct) {
          solved = true;
          btn.classList.add('correct');
          buttons.forEach(function (b) { b.disabled = true; });
          if (explain) { explain.classList.add('show'); explain.classList.remove('miss'); }
        } else {
          btn.classList.add('incorrect');
          btn.disabled = true;
          if (explain) { explain.classList.add('show', 'miss'); }
        }
      });
    });
  }

  function init() {
    Array.prototype.slice
      .call(document.querySelectorAll('.quiz-q'))
      .forEach(wire);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
