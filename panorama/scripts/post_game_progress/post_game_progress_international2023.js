"use strict";
/// <reference path="../dota.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../sequence_actions.ts" />
/// <reference path="post_game_progress_utils.ts" />
/// <reference path="post_game_progress_sequence.ts" />
const HERO_PROGRESS_INCOMPLETE = 0;
const HERO_PROGRESS_HALF = 1;
const HERO_PROGRESS_COMPLETE = 2;
class AnimateInternational2023ScreenAction extends RunSequentialActions {
    data;
    constructor(data) {
        super();
        this.data = data.international2023_progress;
    }
    start() {
        // Create the screen and do a bunch of initial setup
        var panel = StartNewScreen("International2023ProgressScreen");
        panel.BLoadLayoutSnippet("International2023Progress");
        this.actions.push(
            new AddScreenLinkAction(panel, "International2023Progress", "#DOTA_International2023PostGame_Progress"),
        );
        panel.SetDialogVariableInt("quest_difficulty", this.data.quest_difficulty);
        panel.SetDialogVariableInt("quest_progress", this.data.quest_progress);
        panel.SetDialogVariableInt("quest_reward", this.data.quest_reward);
        var tiShield = panel.FindChildInLayoutFile("TILogoShield");
        this.actions.push(new AddClassAction(tiShield, "Display"));
        this.actions.push(new SkippableAction(new WaitAction(0.1)));
        var headerPanel = panel.FindChildInLayoutFile("Header");
        this.actions.push(new AddClassAction(headerPanel, "Display"));
        this.actions.push(new SkippableAction(new WaitAction(0.4)));
        // Animate heroes
        var heroListPanel = panel.FindChildInLayoutFile("HeroList");
        var progressHeroPanel = null;
        for (var i = 0; i < this.data.heroes.length; ++i) {
            var heroPanel = $.CreatePanel("Panel", heroListPanel, "QuestHero" + i);
            heroPanel.BLoadLayoutSnippet("International2023Hero");
            var heroMovie = heroPanel.FindChildInLayoutFile("QuestHeroMovie");
            heroMovie.heroid = this.data.heroes[i].hero_id;
            var progressClass = "Incomplete";
            if (this.data.heroes[i].past_progress == HERO_PROGRESS_HALF) {
                progressClass = "HalfProgress";
            } else if (this.data.heroes[i].past_progress == HERO_PROGRESS_COMPLETE) {
                progressClass = "Completed";
            }
            heroPanel.AddClass(progressClass);
            this.actions.push(new SkippableAction(new WaitAction(0.2)));
            this.actions.push(new AddClassAction(heroPanel, "Display"));
            this.actions.push(
                new RunFunctionAction(function () {
                    PlaySoundEffect("Relic.Received");
                }),
            );
            if (i == this.data.progress_hero_index) {
                progressHeroPanel = heroPanel;
            }
        }
        this.actions.push(new SkippableAction(new WaitAction(0.5)));
        // Animate progress
        if (progressHeroPanel != null) {
            var progressClass = "NewFullProgress";
            if (this.data.progress_is_half) {
                if (this.data.heroes[this.data.progress_hero_index].past_progress == HERO_PROGRESS_INCOMPLETE) {
                    progressClass = "NewHalfProgress";
                }
            }
            this.actions.push(new AddClassAction(progressHeroPanel, progressClass));
            this.actions.push(
                new RunFunctionAction(function () {
                    PlaySoundEffect("HeroBadgeLevelUpReward.ShowReward");
                }),
            );
        }
        this.actions.push(new SkippableAction(new WaitAction(0.8)));
        var questProgressLabel = panel.FindChildInLayoutFile("QuestProgress");
        this.actions.push(new AddClassAction(questProgressLabel, "Display"));
        if (this.data.quest_progress == this.data.quest_difficulty) {
            this.actions.push(new SkippableAction(new WaitAction(1)));
            this.actions.push(new RemoveClassAction(questProgressLabel, "Display"));
            this.actions.push(new SkippableAction(new WaitAction(0.2)));
            var completeLabel = panel.FindChildInLayoutFile("QuestComplete");
            this.actions.push(new AddClassAction(completeLabel, "Display"));
            this.actions.push(
                new RunFunctionAction(function () {
                    PlaySoundEffect("WeeklyQuest.ClaimReward");
                }),
            );
            this.actions.push(new SkippableAction(new WaitAction(0.5)));
            var rewardsLabel = panel.FindChildInLayoutFile("QuestReward");
            this.actions.push(new AddClassAction(rewardsLabel, "Display"));
            this.actions.push(new SkippableAction(new WaitAction(0.5)));
            this.actions.push(
                new RunFunctionAction(function () {
                    PlaySoundEffect("Shards.Stop.Increase");
                }),
            );
        }
        this.actions.push(new StopSkippingAheadAction());
        this.actions.push(new SkippableAction(new WaitAction(1.0)));
        super.start();
    }
}
function TestAnimateInternational2023() {
    const data = {
        international2023_progress: {
            progress_hero_index: 3,
            progress_is_half: false,
            quest_difficulty: 3,
            quest_progress: 3,
            quest_reward: 1000,
            heroes: [
                {
                    hero_id: 11,
                    past_progress: HERO_PROGRESS_COMPLETE,
                },
                {
                    hero_id: 2,
                    past_progress: HERO_PROGRESS_COMPLETE,
                },
                {
                    hero_id: 41,
                    past_progress: HERO_PROGRESS_INCOMPLETE,
                },
                {
                    hero_id: 18,
                    past_progress: HERO_PROGRESS_INCOMPLETE,
                },
                {
                    hero_id: 32,
                    past_progress: HERO_PROGRESS_HALF,
                },
            ],
        },
    };
    TestProgressAnimation(data);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdF9nYW1lX3Byb2dyZXNzX2ludGVybmF0aW9uYWwyMDIzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vY29udGVudC9kb3RhL3Bhbm9yYW1hL3NjcmlwdHMvcG9zdF9nYW1lX3Byb2dyZXNzL3Bvc3RfZ2FtZV9wcm9ncmVzc19pbnRlcm5hdGlvbmFsMjAyMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDO0FBQ3JDLG1DQUFtQztBQUNuQywrQ0FBK0M7QUFDL0Msb0RBQW9EO0FBQ3BELHVEQUF1RDtBQUV2RCxNQUFNLHdCQUF3QixHQUFHLENBQUMsQ0FBQztBQUNuQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQUM3QixNQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBQztBQXdCakMsTUFBTSxvQ0FBcUMsU0FBUSxvQkFBb0I7SUFFdEUsSUFBSSxDQUE4QjtJQUVsQyxZQUFhLElBQWlDO1FBRTdDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUM7SUFDN0MsQ0FBQztJQUVELEtBQUs7UUFFSixvREFBb0Q7UUFDcEQsSUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFFLGlDQUFpQyxDQUFFLENBQUM7UUFDaEUsS0FBSyxDQUFDLGtCQUFrQixDQUFFLDJCQUEyQixDQUFFLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsSUFBSSxtQkFBbUIsQ0FBRSxLQUFLLEVBQUUsMkJBQTJCLEVBQUUsMENBQTBDLENBQUUsQ0FBRSxDQUFDO1FBRS9ILEtBQUssQ0FBQyxvQkFBb0IsQ0FBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFFLENBQUM7UUFDN0UsS0FBSyxDQUFDLG9CQUFvQixDQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFFLENBQUM7UUFDekUsS0FB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
