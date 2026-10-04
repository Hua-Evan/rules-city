/* Gate 3 主審查室：只負責案件桌面與共用入口。 */
(function(){
  const key='rules-city-gate3-v1';
  const state=()=>window.s||window.state||{};

  window.title=function(){app.innerHTML=`<section class="room official-start"><div class="shade"></div><div class="title"><div class="kicker">GATE 3</div><h1>解釋的邊界</h1><button class="start-btn" onclick="desk()">開始</button></div></section>`};
  window.desk=function(){
    const q=state(),done=q.completed||[];
    const next=done.includes('c1')?(done.includes('c2')?(done.includes('c3')?0:3):2):1;
    const c2Done=done.includes('c2'),c3Done=done.includes('c3');
    const folder=(id,classes,name,subtitle,action)=>`<button data-case="${id}" class="physical-folder ${classes}" onclick="${action}"><b>${name}</b><br><small>${subtitle}</small></button>`;
    const c1=folder('c1',done.includes('c1')?'closed':'','案件一','還沒賣出的大麻',done.includes('c1')?'case1()':next===1?'case1()':"toast('卷宗尚未開啟。')");
    const c2=folder('c2','two '+(c2Done?'':next===2?'':'lock'),'案件二','農作物災害補助申請案',c2Done?"toast('這份卷宗已結案。')":next===2?'case2Start()':"toast('卷宗尚未開啟。')");
    const c3=folder('c3','three '+(c3Done?'':next===3?'':'lock'),'案件三','地是我的，為什麼不能拆？',c3Done?'c3Summary()':next===3?'case3Start()':"toast('卷宗尚未開啟。')");
    app.innerHTML=`<section class="room"><div class="shade"></div><header class="top"><div><b>GATE 3｜解釋的邊界</b><br><small>深夜案件審查室</small></div></header><div class="folder-stack">${c1}${c2}${c3}</div><button class="lawbook real" aria-label="法規資料" onclick="${next===0?'finalLaw()':"toast('先處理桌上的案件。')"}">法規資料</button><button class="journal" onclick="journal()">案件紀錄本</button><button class="restart" onclick="restartGate3()">↻ 重新開始</button></section>`;
  };
  window.returnToGate3Desk=function(){
    closeModal();
    const q=state();
    q.stage='desk';
    window.s=q;window.state=q;
    desk();
  };
  window.restartGate3=function(){modal(`<h2>重新開始第三關</h2><p>選擇要從哪一件案件重新開始。</p><div class="restart-options"><label class="restart-option"><input type="radio" name="restart-from" value="c1"><span><b>案件一</b><small>從頭重新審查三件案件</small></span></label><label class="restart-option"><input type="radio" name="restart-from" value="c2"><span><b>案件二</b><small>保留案件一完成狀態</small></span></label><label class="restart-option"><input type="radio" name="restart-from" value="c3"><span><b>案件三</b><small>保留案件一、二完成狀態</small></span></label></div><div class="restart-actions"><button class="choice" onclick="closeModal()">取消</button><button class="primary" onclick="confirmRestartGate3()">確定重新開始</button></div>`) };
  window.confirmRestartGate3=function(){
    const start=document.querySelector('input[name="restart-from"]:checked')?.value;
    if(!start){toast('請先選擇要從哪一件案件開始。');return}
    const completed=start==='c1'?[]:start==='c2'?['c1']:['c1','c2'];
    s={...state(),stage:'desk',case1:[],case2:[],case3:[],completed,case1Completed:completed.includes('c1'),case2Completed:completed.includes('c2'),case3Completed:false,gate3Completed:false};
    ['case1Runtime','case2Runtime','case3Runtime','case1ActiveModal','case2ActiveModal','case3ActiveModal','pendingCase1Transition','pendingCase2Transition','pendingCase3Transition'].forEach(name=>delete s[name]);
    window.s=s;window.state=s;
    save();
    closeModal();
    desk();
  };
  window.journal=function(){const d=(state().completed||[]);modal(`<h2>案件紀錄本</h2>${d.includes('c1')?'<p>🔍 文義解釋<br>🧩 體系解釋</p>':'<p class="note">目前尚無案件紀錄。</p>'}${d.includes('c2')?'<p>🤝 誠實信用</p>':''}${d.includes('c3')?'<p>🚫 禁止權利濫用</p>':''}`)};
  title();
})();
