var seq;
var debug_animation = false;

var get_dof_value = function (
    start_dof,
    end_dof,
    i_val,
    num_samples,
    a = 2,
    dof_property = "SetDOFFarBlurry",
    msg_prefix = "TEST",
    camera_name = "intro_camera",
    model_id = "#Model",
) {
    var delta = end_dof - start_dof;
    var x = i_val / num_samples;
    var x_a = Math.pow(x, a);
    var diff_a = Math.pow(1 - x, a);
    var y = x_a / (x_a + diff_a);

    var sampled = start_dof + y * delta;

    return function () {
        $("#ModelBackground").FireEntityInput("hero_camera", dof_property, sampled);
    };
};

var RunPageAnimation = function () {
    seq = new RunSequentialActions();

    $("#ModelContainer").RemoveAndDeleteChildren();
    $("#ModelContainer").BLoadLayoutSnippet("ModelSnippet");

    seq.actions.push(new WaitAction(0.35));
    seq.actions.push(
        new RunFunctionAction(function () {
            $.DispatchEvent("DOTASetCurrentDashboardPageFullscreen", true);
        }),
    );
    seq.actions.push(new WaitForClassAction($("#ModelBackground"), "SceneLoaded"));

    seq.actions.push(new AddClassAction($("#MainContainer"), "Initialize"));
    seq.actions.push(new AddClassAction($("#ModelBackground"), "Initialize"));

    seq.actions.push(new PlayAndTrackSoundAction("phantom_assassin_persona_stinger"));
    seq.actions.push(new PlayAndTrackSoundAction("phantom_assassin_persona_sfx"));

    seq.actions.push(
        new RunFunctionAction(function () {
            $("#ModelBackground").FireEntityInput("door_l", "Disable", "0");
            $("#ModelBackground").FireEntityInput("door_r", "Disable", "0");

            $("#ModelBackground").FireEntityInput("phantom_assassin_persona", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow1", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow2", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow2_bg", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow3", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow3_bg", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow4", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow5", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow6", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow7", "Disable", "0");

            $("#ModelBackground").FireEntityInput("pa_shadow_badguy1", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy2", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy3", "Disable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy4", "Disable", "0");
        }),
    );

    seq.actions.push(
        new RunFunctionAction(function () {
            $("#ModelBackground").FireEntityInput("door_l", "Enable", "0");
            $("#ModelBackground").FireEntityInput("door_r", "Enable", "0");

            $("#ModelBackground").FireEntityInput("phantom_assassin_persona", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow1", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow2", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow2_bg", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow3", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow3_bg", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow4", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow5", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow6", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow7", "Enable", "0");

            $("#ModelBackground").FireEntityInput("pa_shadow_badguy1", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy2", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy3", "Enable", "0");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy4", "Enable", "0");

            $("#ModelBackground").FireEntityInput("pa_shadow2", "SetAnimGraphParameter", "sequence=fg");
            $("#ModelBackground").FireEntityInput("pa_shadow2_bg", "SetAnimGraphParameter", "sequence=bg");
            $("#ModelBackground").FireEntityInput("pa_shadow3", "SetAnimGraphParameter", "sequence=fg");
            $("#ModelBackground").FireEntityInput("pa_shadow3_bg", "SetAnimGraphParameter", "sequence=bg");

            $("#ModelBackground").FireEntityInput("pa_shadow_badguy1", "SetAnimGraphParameter", "sequence=running");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy2", "SetAnimGraphParameter", "sequence=door1");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy3", "SetAnimGraphParameter", "sequence=door2");
            $("#ModelBackground").FireEntityInput("pa_shadow_badguy4", "SetAnimGraphParameter", "sequence=falling");
        }),
    );
    seq.actions.push(new WaitAction(7.1));
    seq.actions.push(
        new RunFunctionAction(function () {
            $("#ModelBackground").FireEntityInput("pa_shadow2_bg", "Disable", "0");
        }),
    );

    seq.actions.push(new WaitAction(0.38));
    seq.actions.push(
        new RunFunctionAction(function () {
            $("#ModelBackground").FireEntityInput("pa_shadow3_bg", "Disable", "0");
        }),
    );

    seq.actions.push(new WaitAction(9.7));
    seq.actions.push(new AddClassAction($("#DebutInformation"), "Initialize"));
    seq.actions.push(new AddClassAction($("#InformationBody"), "Initialize"));

    seq.actions.push(new WaitAction(2.0));

    seq.actions.push(
        new RunFunctionAction(function () {
            $.DispatchEvent("DOTAGlobalSceneSetCameraEntity", "ModelBackground", "hero_camera_post", 0.0);
        }),
    );
    seq.actions.push(
        new RunFunctionAction(function () {
            $.DispatchEvent("DOTAGlobalSceneSetRootEntity", "ModelBackground", "root_post");
        }),
    );

    seq.actions.push(new LerpRotateAction($("#ModelBackground"), 0, 0, 0, 0, -1, 1, -0.7, 0.7, 0.0));

    RunSingleAction(seq);
};

var EndPageAnimation = function () {
    if (seq != undefined) {
        seq.finish();
    }

    PlayAndTrackSoundAction.StopAllTrackedSounds();

    $("#MainContainer").RemoveClass("Initialize");
    $("#ModelBackground").RemoveClass("Initialize");

    $("#DebutInformation").RemoveClass("Initialize");
    $("#InformationBody").RemoveClass("Initialize");
};
