/* Gate 3 正式存檔：只保留已完成案件；載入時一律回案件桌面。 */
(function(){
  const completionKey='rules-city-gate3-v1';
  const allowed=new Set(['c1','c2','c3']);
  let prior={};
  try{prior=JSON.parse(localStorage.getItem(completionKey)||'{}')||{}}catch{prior={}}
  const completed=[...new Set([...(prior.completed||[]).filter(id=>allowed.has(id)),...(prior.case1Completed?['c1']:[]),...(prior.case2Completed?['c2']:[]),...(prior.case3Completed?['c3']:[])])];
  const completion={
    case1Completed:completed.includes('c1'),
    case2Completed:completed.includes('c2'),
    case3Completed:completed.includes('c3'),
    gate3Completed:completed.length===3
  };

  if(location.search||location.hash)history.replaceState(null,'',location.pathname);

  // 舊版資料一律壓縮為正式完成紀錄。
  localStorage.setItem(completionKey,JSON.stringify(completion));
  s={...fresh,...completion,completed};
  window.s=s;
  window.state=s;

  // 完成的案件一永遠只開結案摘要，不可因舊 HTML handler 重入案件流程。
  document.addEventListener('click',function(event){
    const folder=event.target.closest('.physical-folder');
    if(!folder||folder.dataset.case!=='c1'||!folder.classList.contains('closed'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.openCase1Summary();
  },true);

  // 不論重新整理、重新開啟或先前網址帶了任何 query，都回正式案件桌面。
  window.title=function(){desk()};
  desk();
})();
