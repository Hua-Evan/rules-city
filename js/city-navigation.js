/* 各關完成後回到規則之城，並以 localStorage 記錄完成狀態。 */
(() => {
  const gate = document.currentScript?.dataset.gate;
  if (!gate) return;
  let installed = false;
  const completeKey = `gate${gate}Completed`;
  const hasFinished = () => {
    const content = document.body?.innerText || '';
    const patterns = {'1': /確認完成|完成第一關/, '2': /程序完成[。\s]*$|尚未完成的法案[\s\S]*重新測試第二關/, '3': /GATE 3 COMPLETE|\bCLEAR\b/, '4': /GATE 4 COMPLETE|已歸檔/, '5': /GATE 5 COMPLETE|任務完成｜關閉此頁/, '6': /GATE 6 COMPLETE/};
    return patterns[gate]?.test(content);
  };
  const addReturn = () => {
    if (!hasFinished()) return;
    localStorage.setItem(completeKey, 'true');
    if (installed || document.querySelector('[data-city-return]')) return;
    installed = true;
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.cityReturn = 'true'; button.className = 'city-return'; button.textContent = '返回規則之城';
    button.addEventListener('click', () => { window.location.href = '../index.html'; });
    document.body.append(button);
  };
  new MutationObserver(addReturn).observe(document.documentElement, {childList:true, subtree:true, characterData:true});
  addReturn();
})();
