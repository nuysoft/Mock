define(['mock'], function(Mock) {
    return Mock.heredoc(function() {
        /*
        <div class="row">
            <div class="col-sm-6 code">
                <span class="badge"><%= badge %></span>
                <pre><code class="javascript"><%= code %></code></pre>
            </div>
            <div class="col-sm-6 result">
                <span class="badge">Result</span>
                <pre><code class="javascript"><%= result %></code></pre>
            </div>
        </div>
         */
    })
})