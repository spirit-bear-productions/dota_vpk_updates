var seq;
var debug_animation = false;

var n_radiant_map_entities = 55;
var n_radiant_map_particles = 5;
var n_chrono_map_entities = 55;
var n_chrono_map_particles = 5;
var n_chrono_tent_entities = 9;

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
    if ($("#MainContainer")) {
        $("#MainContainer").RemoveClass("Initialize");
    }
    if ($("#ModelForeground")) {
        $("#ModelForeground").RemoveClass("Initialize");
    }
    if ($("#ModelBackground")) {
        $("#ModelBackground").RemoveClass("Initialize");
    }
    if ($("#DebutInformation")) {
        $("#DebutInformation").RemoveClass("Initialize");
    }
    if ($("#InformationBody")) {
        $("#InformationBody").RemoveClass("Initialize");
    }

    seq = new RunSequentialActions();

    $("#ModelContainer").RemoveAndDeleteChildren();
    $("#ModelContainer").BLoadLayoutSnippet("ModelSnippet");

    seq.actions.push(new WaitAction(0.35));
    seq.actions.push(
        new RunFunctionAction(function () {
            $.DispatchEvent("DOTASetCurrentDashboardPageFullscreen", true);
        }),
    );
    seq.actions.push(new WaitForClassAction($("#ModelForeground"), "SceneLoaded"));
    seq.actions.push(new WaitForClassAction($("#ModelBackground"), "SceneLoaded"));

    seq.actions.push(
        new RunFunctionAction(function () {
            for (var i = 0; i < n_chrono_map_entities; ++i) {
                $("#ModelBackground").FireEntityInput("chronoEntity" + i, "Disable", "0");
            }

            for (var i = 0; i < n_chrono_tent_entities; i++) {
                $("#ModelBackground").FireEntityInput("tent" + i, "Disable", "0");
            }
        }),
    );

    seq.actions.push(new AddClassAction($("#MainContainer"), "Initialize"));
    seq.actions.push(new AddClassAction($("#ModelForeground"), "Initialize"));
    seq.actions.push(new AddClassAction($("#ModelBackground"), "Initialize"));

    seq.actions.push(new PlayAndTrackSoundAction("faceless_arcana_debut_stinger"));
    seq.actions.push(new PlayAndTrackSoundAction("faceless_arcana_debut_sfx"));

    seq.actions.push(new WaitAction(6.8));
    seq.actions.push(new RunFunctionAction(display_chrono));

    for (var i = 0; i < 45; i++) {
        seq.actions.push(new WaitOneFrameAction());
    }

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

    seq.actions.push(new LerpRotateAction($("#ModelBackground"), 0, 0, 0, 0, -0.7, 0.7, -0.3, 0.3, 0.0));

    seq.actions.push(new AddClassAction($("#DebutInformation"), "Initialize"));

    RunSingleAction(seq);
};

var EndPageAnimation = function () {
    if (seq != undefined) {
        seq.finish();
    }

    PlayAndTrackSoundAction.StopAllTrackedSounds();

    $("#MainContainer").RemoveClass("Initialize");
    $("#ModelForeground").RemoveClass("Initialize");
    $("#ModelBackground").RemoveClass("Initialize");

    $("#DebutInformation").RemoveClass("Initialize");
    $("#InformationBody").RemoveClass("Initialize");
};

var display_chrono = function () {
    $("#ModelBackground").FireEntityInput("banner", "Disable", "0");
    $("#ModelBackground").FireEntityInput("Ground", "Disable", "0");

    for (var i = 0; i < n_radiant_map_entities; ++i) {
        $("#ModelBackground").FireEntityInput("radiantEntity" + i, "Disable", "0");
    }
    for (var i = 0; i < n_radiant_map_particles; ++i) {
        $("#ModelBackground").FireEntityInput("radiantParticle" + i, "Disable", "0");
    }

    for (var i = 0; i < n_chrono_map_entities; ++i) {
        $("#ModelBackground").FireEntityInput("chronoEntity" + i, "Enable", "0");
    }
    for (var i = 0; i < n_chrono_map_particles; ++i) {
        $("#ModelBackground").FireEntityInput("radiantParticle" + i, "Enable", "0");
    }

    for (var i = 0; i < n_chrono_tent_entities; i++) {
        $("#ModelBackground").FireEntityInput("tent" + i, "Enable", "0");
        $("#ModelBackground").FireEntityInput("tent" + i, "SetAnimGraphParameter", "sequence=tent" + i);
    }
};

var display_radiant = function () {
    for (var i = 0; i < n_radiant_map_entities; ++i) {
        $("#ModelBackground").FireEntityInput("radiantEntity" + i, "Enable", "0");
    }
    for (var i = 0; i < n_radiant_map_particles; ++i) {
        $("#ModelBackground").FireEntityInput("radiantParticle" + i, "Enable", "0");
    }

    for (var i = 0; i < n_chrono_map_particles; ++i) {
        $("#ModelBackground").FireEntityInput("chronoEntity" + i, "Disable", "0");
    }
    for (var i = 0; i < n_radiant_map_particles; ++i) {
        $("#ModelBackground").FireEntityInput("radiantParticle" + i, "Disable", "0");
    }
    for (var i = 0; i < n_chrono_tent_entities; i++) {
        $("#ModelBackground").FireEntityInput("tent" + i, "Disable", "0");
    }
};
