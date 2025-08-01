var animGuardAction;
var debug_animation = false;

var get_dof_value = function (
    start_dof,
    end_dof,
    i_val,
    num_samples,
    a = 2,
    dof_property = "SetDOFFarBlurry",
    msg_prefix = "TEST",
    camera_name = "hero_camera",
    model_id = "#ModelForeground",
) {
    var delta = end_dof - start_dof;
    var x = i_val / num_samples;
    var x_a = Math.pow(x, a);
    var diff_a = Math.pow(1 - x, a);
    var y = x_a / (x_a + diff_a);

    var sampled = start_dof + y * delta;

    return function () {
        $(model_id).FireEntityInput(camera_name, dof_property, sampled);
    };
};

var RunPageAnimation = function () {
    PlayAndTrackSoundAction.StopAllTrackedSounds();

    if (animGuardAction != undefined) animGuardAction.TriggerFailure();
    $("#ModelContainer").RemoveAndDeleteChildren();

    $("#ModelContainer").BLoadLayoutSnippet("ModelSnippet");
    $("#MarciDebutMovie").RemoveClass("MovieFinished");

    var seq = new RunSequentialActions();
    seq.actions.push(new WaitAction(0.01));
    seq.actions.push(
        new RunFunctionAction(function () {
            $.DispatchEvent("DOTASetCurrentDashboardPageFullscreen", true);
        }),
    );
    seq.actions.push(new PlayMovieAction($("#MarciDebutMovie")));
    seq.actions.push(new AddClassAction($("#MarciDebutMovie"), "MovieFinished"));

    seq.actions.push(new WaitForClassAction($("#ModelForeground"), "SceneLoaded"));
    seq.actions.push(new WaitForClassAction($("#ModelForeground_FG"), "SceneLoaded"));

    seq.actions.push(new PlayAndTrackSoundAction("marci_debut_stinger"));
    seq.actions.push(new PlayAndTrackSoundAction("marci_debut_sfx"));

    seq.actions.push(new AddClassAction($("#MainContainer"), "Initialize"));
    seq.actions.push(new AddClassAction($("#ModelForeground"), "Initialize"));
    seq.actions.push(new AddClassAction($("#ModelForeground_FG"), "Initialize"));

    if (debug_animation) {
        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground_FG").FireEntityInput("marci", "SetAnimation", "marci_debut_anim_loop");
            }),
        );
        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground_FG").FireEntityInput(
                    "hero_camera_driver",
                    "SetAnimation",
                    "debut_camera_last_frame",
                );
            }),
        );

        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground").FireEntityInput("hero_camera_driver", "SetAnimation", "debut_camera_last_frame");
            }),
        );
    } else {
        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground_FG").FireEntityInput("hero_camera_driver", "SetAnimation", "debut_camera_anim");
            }),
        );
        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground").FireEntityInput("hero_camera_driver", "SetAnimation", "debut_camera_anim");
            }),
        );

        seq.actions.push(new WaitAction(3.6));
        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground_FG").FireEntityInput("marci", "SetAnimation", "marci_debut_anim");
            }),
        );

        seq.actions.push(new WaitAction(2.4));

        num_samples = 25;
        s_far_crisp = 2000;
        s_far_blurry = 4000;
        e_far_crisp = 1100;
        e_far_blurry = 2000;

        dt = 5.5 / num_samples;
        for (var i = 0; i <= num_samples; i++) {
            seq.actions.push(new WaitAction(dt));

            fn = get_dof_value(s_far_crisp, e_far_crisp, i, num_samples, (a = 2), (dof_property = "SetDOFFarCrisp"));
            seq.actions.push(new RunFunctionAction(fn));

            fn = get_dof_value(s_far_blurry, e_far_blurry, i, num_samples, (a = 2), (dof_property = "SetDOFFarBlurry"));
            seq.actions.push(new RunFunctionAction(fn));
        }

        seq.actions.push(new AddClassAction($("#DebutInformation"), "Initialize"));
        seq.actions.push(new AddClassAction($("#InformationBody"), "Initialize"));

        seq.actions.push(new WaitAction(2.84));

        seq.actions.push(
            new RunFunctionAction(function () {
                $.DispatchEvent("DOTAGlobalSceneSetCameraEntity", "ModelForeground", "hero_camera_post", 4.0);
            }),
        );
        seq.actions.push(
            new RunFunctionAction(function () {
                $.DispatchEvent("DOTAGlobalSceneSetCameraEntity", "ModelForeground_FG", "hero_camera_post", 4.0);
            }),
        );
        seq.actions.push(
            new RunFunctionAction(function () {
                $.DispatchEvent("DOTAGlobalSceneSetRootEntity", "ModelForeground", "root_post");
            }),
        );
        seq.actions.push(
            new RunFunctionAction(function () {
                $.DispatchEvent("DOTAGlobalSceneSetRootEntity", "ModelForeground_FG", "root_post");
            }),
        );
        seq.actions.push(new LerpRotateAction($("#ModelForeground"), 0, 0, 0, 0, -1.25, 1.25, -0.33, 0.33, 0.1));
        seq.actions.push(new LerpRotateAction($("#ModelForeground_FG"), 0, 0, 0, 0, -1.25, 1.25, -0.33, 0.33, 0.1));

        seq.actions.push(
            new RunFunctionAction(function () {
                $("#ModelForeground_FG").FireEntityInput("marci", "SetAnimation", "marci_debut_anim_loop");
            }),
        );
    }

    animGuardAction = new GuardedAction(seq);

    RunSingleAction(animGuardAction);
};

var EndPageAnimation = function () {
    PlayAndTrackSoundAction.StopAllTrackedSounds();

    $("#MainContainer").RemoveClass("Initialize");
    if (animGuardAction != undefined) {
        animGuardAction.finish();

        $("#ModelForeground").RemoveClass("Initialize");
        $("#ModelForeground_FG").RemoveClass("Initialize");

        $("#DebutInformation").RemoveClass("Initialize");
        $("#InformationBody").RemoveClass("Initialize");
    }
};
