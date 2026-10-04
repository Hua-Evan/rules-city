/* 由說話者名稱同步替換半身立繪；玩家選項畫面使用學生立繪。 */
(() => {
  const app = document.getElementById('app');
  const portrait = { '站務人員':'station', '其他乘客':'passenger', '警察甲':'police-a', '警察乙':'police-b', '被盤查路人':'pedestrian', '你':'player' };
  const update = () => {
    app.querySelectorAll('.rpg-dialogue__box').forEach((box) => {
      const name = box.querySelector('.rpg-dialogue__name')?.textContent.trim();
      if (portrait[name]) box.dataset.portrait = portrait[name];
    });
    app.querySelectorAll('.rpg-dialogue__choices').forEach((choices) => { choices.dataset.portrait = 'player'; });
  };
  new MutationObserver(update).observe(app, { childList:true, subtree:true });
  update();
})();
