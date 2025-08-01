/// <reference path="../dota.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../common/async.ts" />
/// <reference path="../dota_sequence_actions.ts" />

var g_abort: Async.AbortController | undefined;
var g_soundGuids: number[] = [];

const ULT_ENTITIES = ["ult_sky", "ult_env"];
const ULT_ACTIVE_FX = [
    "ult_debut_fx_1",
    "ult_debut_fx_2",
    "ult_debut_fx_3",
    "ult_debut_fx_4",
    "ult_debut_fx_5",
    "ult_debut_fx_6",
    "ult_debut_fx_7",
    "ult_debut_fx_8",
    "ult_debut_fx_9",
    "ult_debut_fx_10",
    "ult_debut_fx_31",

    "ult_debut_fx_22",
    "ult_debut_fx_23",
    "ult_debut_fx_24",

    "ult_debut_fx_11",
    "ult_debut_fx_17",
    "ult_debut_fx_18",
    "ult_debut_fx_25",

    "ult_debut_fx_46",
    "ult_debut_fx_47",
    "ult_debut_fx_48",
    "ult_debut_fx_49",
    "ult_debut_fx_50",
    "ult_debut_fx_51",

    "ult_debut_fx_32",
    "ult_debut_fx_33",
    "ult_debut_fx_34",
    "ult_debut_fx_35",
    "ult_debut_fx_36",
    "ult_debut_fx_37",
    "ult_debut_fx_38",
    "ult_debut_fx_39",
    "ult_debut_fx_40",
    "ult_debut_fx_41",
    "ult_debut_fx_42",
    "ult_debut_fx_43",
    "ult_debut_fx_44",
    "ult_debut_fx_45",

    "ult_debut_fx_26",

    "ult_ambient_fx_1",
];
const ULT_INACTIVE_FX = ["ult_debut_fx_27", "ult_debut_fx_28", "ult_debut_fx_29", "ult_debut_fx_30"];
const ULT_LIGHTS = [
    "swirl_light",
    "ult_env_light_1",
    "ult_env_light_2",
    "ult_env_light_3",
    "ult_env_light_4",
    "ult_env_light_5",
    "ult_env_light_6",
    "ult_env_light_7",
    "ult_env_light_8",
    "ult_env_light_9",
    "red_flowers",
];

const END_ENTITIES = ["tree_env", "muerta_base", "debut_end_plate"];
const END_FX = [
    "debut_fx_1",
    "debut_fx_2",
    "debut_fx_3",
    "debut_fx_4",
    "debut_fx_5",
    "debut_fx_6",
    "debut_fx_7",
    "debut_fx_8",
    "debut_fx_9",
    "debut_fx_10",
    "debut_fx_11",
    "debut_fx_12",
    "debut_fx_13",
    "debut_fx_14",
    "debut_fx_15",
    "debut_fx_16",
    "debut_fx_17",
    "debut_fx_18",
    "debut_fx_19",
    "debut_fx_20",
    "debut_fx_21",
    "debut_fx_22",
    "debut_fx_23",
    "debut_fx_24",
    "debut_fx_25",
    "debut_fx_26",
    "debut_fx_27",
    "debut_fx_28",
    "debut_fx_29",
    "debut_fx_30",
    "debut_fx_31",

    "debut_fx_35",
    "debut_fx_36",
    "debut_fx_38",
    "debut_fx_39",
    "debut_fx_40",
    "debut_fx_41",
    "debut_fx_42",
    "debut_fx_43",

    "base_ambient_fx_1",

    "godray1",
    "godray2",
    "godray3",
    "godray4",
    "godray5",
    "godray6",
    "godray7",
    "godray8",
    "godray9",
    "godray10",
    "godray11",
];

function LoadMuertaLogo() {
    const cp = $.GetContextPanel();
    const bIsChinese = cp.BAscendantHasClass("Language_schinese") || cp.BAscendantHasClass("Language_tchinese");
    $("#LogoMovieContainer")!.BLoadLayoutSnippet(bIsChinese ? "MuertaTitleChinese" : "MuertaTitleEnglish");
}

function StartMuertaDebut() {
    EndMuertaDebut();

    g_abort = new Async.AbortController();
    Async.RunSequence(MuertaSequence, g_abort.signal);
}

function EndMuertaDebut() {
    if (g_abort) {
        g_abort.abort();
        g_abort = undefined;
    }

    $("#MainContainer")!.RemoveClass("Initialize");
    $("#ModelBackground")?.RemoveClass("Initialize");

    $("#DebutInformation")!.RemoveClass("Initialize");
    $("#InformationBody")!.RemoveClass("Initialize");

    g_soundGuids.forEach(StopUISoundScript);
    g_soundGuids = [];
}

function* MuertaSequence(abortSignal: Async.AbortSignal_t) {
    $.RegisterForUnhandledEvent("DynamicPropAnimEvent", function (...args) {});
    const bIsWide = $.GetContextPanel().BAscendantHasClass("AspectRatio21x9");

    const pContainer = $("#ModelContainer")!;
    pContainer.RemoveAndDeleteChildren();
    pContainer.BLoadLayoutSnippet(bIsWide ? "ModelSnippetWide" : "ModelSnippet");

    const pMain = $("#MainContainer") as Panel_t;
    const pScene = $("#ModelBackground") as DOTAScenePanel_t;
    const pDebutFX = $("#DebutFXPanel") as DOTAParticleScenePanel_t;

    yield Async.Delay(0.35);

    $.DispatchEvent("DOTASetCurrentDashboardPageFullscreen", true);

    yield Async.Condition(() => pScene.BHasClass("SceneLoaded"), abortSignal);

    const sceneLoadedTime = new Async.TimeStamp();

    pMain.AddClass("Initialize");
    pScene.AddClass("Initialize");

    g_soundGuids.push(PlayUISoundScript("muerta_debut_stinger"));
    g_soundGuids.push(PlayUISoundScript("muerta_debut_sfx"));

    pScene.FireEntityInput("satyr_a", "SetAnimation", "muerta_debut_satyr_a");
    pScene.FireEntityInput("satyr_b", "SetAnimation", "muerta_debut_satyr_b");
    pScene.FireEntityInput("satyr_c", "SetAnimation", "muerta_debut_satyr_c");
    END_ENTITIES.forEach((ent) => pScene.FireEntityInput(ent, "Disable"));
    ["ghost0", "ghost1", "ghost2"].forEach((ent) => pScene.FireEntityInput(ent, "Disable"));

    pDebutFX.AddClass("Initialize");

    const shot1 = Async.RunSequence(Shot1, abortSignal);
    const shot2 = Async.RunSequence(Shot2, abortSignal);

    yield Promise.all([shot1, shot2]);
    yield Async.Delay(0.1);

    pScene.FireEntityInput("ult_debut_fx_36", "Start");

    yield Async.Delay(0.25);

    pScene.FireEntityInput("ghost0_fx", "Start");
    pScene.FireEntityInput("ghost0", "Enable");

    yield Async.Delay(0.5);

    pScene.FireEntityInput("ghost1_fx", "Start");
    pScene.FireEntityInput("ghost1", "Enable");
    pScene.FireEntityInput("ghost2", "Enable");

    yield Async.UnhandledEvent("DynamicPropAnimEvent", "muerta_ult", "transition");

    pScene.FireEntityInput("ult_debut_fx_27", "Start");
    pScene.FireEntityInput("muerta_ult", "Disable");

    ULT_ENTITIES.forEach((ent) => pScene.FireEntityInput(ent, "Disable"));
    ULT_ACTIVE_FX.forEach((ent) => pScene.FireEntityInput(ent, "DestroyImmediately"));
    ["ghost0_fx", "ghost1_fx", "ghost2_fx"].forEach((ent) => pScene.FireEntityInput(ent, "StopPlayEndCap"));
    ULT_LIGHTS.forEach((ent) => pScene.FireEntityInput(ent, "Intensity"));
    END_ENTITIES.forEach((ent) => pScene.FireEntityInput(ent, "Enable"));
    END_FX.forEach((ent) => pScene.FireEntityInput(ent, "Start"));

    yield Async.Delay(1.0);

    $("#DebutInformation")!.AddClass("Initialize");
    $("#InformationBody")!.AddClass("Initialize");
    pDebutFX.StartParticles();

    yield Async.Delay(4.0);

    $.DispatchEvent("DOTAGlobalSceneSetCameraEntity", "ModelBackground", "hero_camera_post", 0.0);
    $.DispatchEvent("DOTAGlobalSceneSetRootEntity", "ModelBackground", "root_post");

    pScene.SetRotateParams(-0.75, 0.75, -0.25, 0.25);

    yield Async.UnhandledEvent("DynamicPropAnimEvent", "muerta_base", "base_end");

    pScene.FireEntityInput("muerta_base", "SetAnimation", "muerta_debut_base_idle");
}

function* Shot1() {
    const pScene = $("#ModelBackground") as DOTAScenePanel_t;

    yield Async.UnhandledEvent("DynamicPropAnimEvent", "muerta_ult", "shot1");
    pScene.FireEntityInput("tracer1_fx", "Start");

    yield Async.UnhandledEvent("DynamicPropAnimEvent", "satyr_c", "impact1");
    pScene.FireEntityInput("tracer1_fx", "StopPlayEndCap");
    pScene.FireEntityInput("impact3", "Start");
}

function* Shot2() {
    const pScene = $("#ModelBackground") as DOTAScenePanel_t;

    yield Async.UnhandledEvent("DynamicPropAnimEvent", "muerta_ult", "shot2");
    pScene.FireEntityInput("tracer2_fx", "Start");

    yield Async.Delay(0.23);
    pScene.FireEntityInput("tracer2_fx", "StopPlayEndCap");
    pScene.FireEntityInput("impact1", "Start");
    pScene.FireEntityInput("tracer3_fx", "Start");

    yield Async.Delay(0.17);
    pScene.FireEntityInput("tracer3_fx", "StopPlayEndCap");
    pScene.FireEntityInput("impact2", "Start");
}
