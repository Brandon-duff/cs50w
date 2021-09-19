document.addEventListener('DOMContentLoaded', function() {
  prepare_edit_links();
});

function prepare_edit_links(){
  let posts = document.querySelectorAll("div.post-div");
  posts.forEach((input) => {
    const edit_link = input.querySelector("span.edit-label");
    edit_link.addEventListener('click', ()=>edit_post(input));
  });
}

function edit_post(post){
  let post_text_div = post.querySelector("div.post-context")
  let edit_text_div = post.querySelector("span.edit-label")
  let post_id = post.querySelector("input.post-id").value
  let original_html = post_text_div.innerHTML
  let original_post = post_text_div.innerText
  edit_text_div.style.display = "none"

  const edit_div = document.createElement('div');
  let new_html = `
      <div class="row m-2">
        <div class="col-4">
            <textarea type="text" name="post-text" class="form-control mb-2 edited-post" rows="3">${original_post}</textarea>
            <div class="row d-flex align-items-center justify-content-center ">
                <div class="col"><button type="button" class="btn btn-primary">Save</button></div>
                <div class="col"><span class="cancel-edit-label">Cancel</span></div>
            </div>            
        </div>
    </div>`

  post_text_div.innerHTML = new_html;

  let cancelEditLabel = post_text_div.querySelector("span.cancel-edit-label")
  let sendEditButton = post_text_div.querySelector("button")

  cancelEditLabel.addEventListener('click', ()=>cancelEdit())
  sendEditButton.addEventListener('click', ()=>sendEdit())

  function cancelEdit()
  {
    post_text_div.innerHTML = original_html
    edit_text_div.style.display="block"
  }

  function sendEdit()
  {
      let new_text = post_text_div.querySelector("textarea.edited-post").value
      const csrftoken = getCookie('csrftoken');

      const request = new Request(
        `/post/${post_id}/edit`,
        {headers: {'X-CSRFToken': csrftoken}}
    );

      fetch(request, {
          method: 'POST',
          body: JSON.stringify({
              edited_text: new_text,
          })
       }).then(response => {
           if(response.status = 200){
                restoreView(new_text);
           }
           else{
                restoreView(original_post)
           }

      });
  }

  function restoreView(postContent){
      post_text_div.innerHTML = original_html;
      post_text_div.innerText = postContent;
      edit_text_div.style.display="block";
  }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}