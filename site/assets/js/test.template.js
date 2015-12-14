define(['mock'], function(Mock) {
    return Mock.heredoc(function() {
        /*
        <div class="row">
            <div class="col-sm-6">
                <div class="code">
                    <span class="badge"><%= badge %></span>
                    <pre><code class="javascript"><%= code %></code></pre>
                    <a href="javascript:;" class="mockicon copy"></a>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="result">
                    <span class="badge">Result</span>
                    <pre><code class="javascript"><%= result %></code></pre>
                    <a href="javascript:;" class="mockicon rerun"></a>
                </div>
            </div>
        </div>
         */
    })
})