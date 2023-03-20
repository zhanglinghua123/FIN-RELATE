const mutationdict : {
    [key: number]: MutationObserver;
} = {} 
const addMutation = (id:number,onchange:()=>void,div:HTMLElement)=>{
    let DocumentObserver = new MutationObserver(onchange);
      const DocumentObserverConfig = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      };
      DocumentObserver.observe(div, DocumentObserverConfig);
      if(id in mutationdict){
        console.log("已经存在该id的mutationObserver!")
        return false
      }else{
        mutationdict[id] = DocumentObserver
        return true
      }
}
const removeMutation = (id:number)=>{
    if(id in mutationdict){
        mutationdict[id].disconnect()
    }else{
        console.log("不存在该id的mutationObserver!")
        return false
    }
}

export {
    addMutation,
    removeMutation
}