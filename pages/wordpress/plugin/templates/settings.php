<?php
?>

<div class="wrap">
    <h2 style="display: none"></h2>
    <?php

    ?>
    <div id="Connect-OAuth" class="tabcontent">
        <h2>Wix Headless</h2>
        <form method="post" action="options.php">
            <?php settings_fields('wix_headless_example_settings_group'); ?>
            <?php do_settings_sections('wix-headless-example-settings'); ?>
            <table class="form-table">
                <tr style="vertical-align:top">
                    <th scope="row">Wix Client ID</th>
                    <td>
                        <input required type="text" name="wix_example_client_id" value="<?php echo esc_attr(get_option('wix_example_client_id')); ?>" />
                    </td>
                </tr>
                <!-- Add more settings fields here -->
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
</div>
