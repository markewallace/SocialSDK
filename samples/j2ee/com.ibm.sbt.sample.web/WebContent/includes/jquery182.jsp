<script type="text/javascript" src="/sbt/js/libs/require.js"></script>
<script type="text/javascript">
requirejs.config({
       paths: {
           'jquery' : '/sbt.jquery182/js/jquery-1.8.2.min',
           'jquery/ui' : '/sbtx.jquery182/js/jquery-ui-1.8.24.custom.min',
        },
        shim : {
            'jquery/ui' : {
                deps : [ 'jquery' ],
                exports : 'jQuery'
            }
        }
    });
</script>
