document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. シミリスク診断機能 (Risk Calculator)
     ========================================================================== */
  const btnDiagnose = document.getElementById('btn-diagnose');
  const selectMenu = document.getElementById('menu-select');
  const resultBox = document.getElementById('result-box');
  const resultScore = document.getElementById('result-score');
  const resultProgress = document.getElementById('result-progress');
  const resultText = document.getElementById('result-text');

  btnDiagnose.addEventListener('click', () => {
    const isWhiteClothing = document.querySelector('input[name="clothing"]:checked').value === 'white';
    const selectedOption = selectMenu.options[selectMenu.selectedIndex];
    const baseRisk = parseInt(selectedOption.getAttribute('data-risk'));
    const menuName = selectedOption.text.split('(')[0].trim();

    // Calculate final risk score based on clothing
    let finalRisk = baseRisk;
    if (!isWhiteClothing) {
      finalRisk = Math.max(10, Math.round(baseRisk * 0.25)); // Reduce risk significantly for dark/safe clothing
    }

    // Display result box with smooth reveal
    resultBox.classList.remove('hidden');

    // Update risk meter and progress bar
    resultScore.textContent = `${finalRisk}%`;
    resultProgress.style.width = `${finalRisk}%`;

    // Alert messages based on risk level
    let message = '';
    if (finalRisk >= 85) {
      message = `🚨 警告: 破滅的リスクです！「${menuName}」はおろしたての白い服の天敵。一口すするたびにミートソースやスープが四方に散乱する未来が視えます。今すぐ「超撥水Tシャツ」を着用するか、食事をサラダに変更してください！`;
      resultBox.style.background = 'rgba(239, 68, 68, 0.08)';
      resultBox.style.borderColor = 'rgba(239, 68, 68, 0.2)';
      resultScore.style.color = '#ef4444';
    } else if (finalRisk >= 60) {
      message = `⚠️ 警戒: かなり危険です。お気に入りの白い服が一瞬で部屋着（または雑巾）に格下げされる危険性があります。ハネを警戒し、常に前かがみになって息を止めて食べることを推奨します。`;
      resultBox.style.background = 'rgba(245, 158, 11, 0.08)';
      resultBox.style.borderColor = 'rgba(245, 158, 11, 0.2)';
      resultScore.style.color = '#f59e0b';
    } else if (finalRisk >= 30) {
      message = `🔍 注意: 多少のハネが発生する可能性があります。ナプキンを首元からかけるなど、予防策を講じれば回避可能ですが、油断するとスマホを見ている隙にポツリとシミがつくでしょう。`;
      resultBox.style.background = 'rgba(59, 130, 246, 0.08)';
      resultBox.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      resultScore.style.color = '#3b82f6';
    } else {
      message = `✅ 安全: シミ危険度は極めて低いです。今日のあなたは白い服を汚す心配なく、優雅にディナーを堪能できます。安心して楽しんでください。`;
      resultBox.style.background = 'rgba(16, 185, 129, 0.08)';
      resultBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
      resultScore.style.color = '#10b981';
    }

    resultText.textContent = message;

    // Scroll to result box smoothly on mobile
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });


  /* ==========================================================================
     2. 超撥水シミュレーター (T-Shirt Spill Simulator)
     ========================================================================== */
  const shieldToggle = document.getElementById('shield-toggle');
  const shieldStatus = document.getElementById('shield-status');
  const sauceButtons = document.querySelectorAll('.sauce-btn');
  const btnSpill = document.getElementById('btn-spill');
  const liquidDrop = document.getElementById('liquid-drop');
  const stainOverlay = document.getElementById('stain-overlay');
  const tshirtSvg = document.getElementById('tshirt-svg');

  let activeSauce = 'tomato'; // default

  // Switch active sauce type
  sauceButtons.forEach(button => {
    button.addEventListener('click', () => {
      sauceButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeSauce = button.getAttribute('data-sauce');
      resetStain();
    });
  });

  // Shield Toggle Behavior
  shieldToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      shieldStatus.textContent = 'ON (撥水モード)';
      shieldStatus.className = 'shield-status active';
    } else {
      shieldStatus.textContent = 'OFF (一般モード)';
      shieldStatus.className = 'shield-status inactive';
    }
    resetStain();
  });

  // Spill Action
  btnSpill.addEventListener('click', () => {
    if (btnSpill.disabled) return;
    
    // Disable button during animation
    btnSpill.disabled = true;
    resetStain();

    const isShieldOn = shieldToggle.checked;
    
    // Setup liquid drop visual
    liquidDrop.className = 'liquid-drop';
    if (activeSauce === 'tomato') {
      liquidDrop.classList.add('tomato-drop');
    } else if (activeSauce === 'coffee') {
      liquidDrop.classList.add('coffee-drop');
    } else if (activeSauce === 'wine') {
      liquidDrop.classList.add('wine-drop');
    }
    
    // Drop animation start
    liquidDrop.style.top = '10px';
    liquidDrop.style.transform = 'rotate(-45deg) scale(1)';
    liquidDrop.classList.remove('hidden');

    // Step 1: Liquid falls onto the shirt
    setTimeout(() => {
      liquidDrop.style.top = '100px'; // hit position
    }, 50);

    // Step 2: Impact!
    setTimeout(() => {
      if (isShieldOn) {
        // Superhydrophobic effect: drop bounces/rolls off
        liquidDrop.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        liquidDrop.style.top = '160px'; // rolls down
        liquidDrop.style.left = 'calc(50% + 50px)'; // rolls to the right
        liquidDrop.style.transform = 'rotate(-45deg) scale(0.3)'; // shrinks as it rolls away
        liquidDrop.style.opacity = '0';

        // T-shirt stays clean
        setTimeout(() => {
          liquidDrop.classList.add('hidden');
          btnSpill.disabled = false;
        }, 500);

      } else {
        // Normal T-shirt: Stain spreads immediately
        liquidDrop.classList.add('hidden');
        
        // Show stain on shirt
        stainOverlay.className = 'stain-overlay';
        stainOverlay.style.width = '30px';
        stainOverlay.style.height = '24px';
        stainOverlay.style.top = '90px';
        stainOverlay.style.left = '85px';
        
        if (activeSauce === 'tomato') {
          stainOverlay.style.backgroundColor = 'var(--accent-red)';
        } else if (activeSauce === 'coffee') {
          stainOverlay.style.backgroundColor = 'var(--accent-brown)';
        } else if (activeSauce === 'wine') {
          stainOverlay.style.backgroundColor = 'var(--accent-purple)';
        }

        // Juwaaa... Stain spreads
        stainOverlay.style.opacity = '0.85';
        stainOverlay.style.transform = 'scale(1.8)';
        
        setTimeout(() => {
          btnSpill.disabled = false;
        }, 600);
      }
    }, 450);
  });

  function resetStain() {
    stainOverlay.style.opacity = '0';
    stainOverlay.style.transform = 'scale(0)';
    liquidDrop.classList.add('hidden');
    liquidDrop.style.transition = 'top 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
    liquidDrop.style.left = 'calc(50% - 7px)';
  }


  /* ==========================================================================
     3. 応急処置ガイドのタブ切り替え (Emergency Guide Tabs)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.guide-tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Update button classes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update content classes
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `guide-${targetTab}`) {
          content.classList.add('active');
        }
      });
    });
  });

});
