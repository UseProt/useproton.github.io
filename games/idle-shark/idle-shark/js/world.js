(SharkGame.WorldModifiers = {
  planetaryIncome: {
    name: "Planetary Income",
    apply: function (e, r, o) {
      SharkGame.World.worldResources[r].income = e * o;
    },
  },
  planetaryIncomeMultiplier: {
    name: "Planetary Income Multiplier",
    apply: function (e, r, o) {
      SharkGame.World.worldResources[r].incomeMultiplier = e * o;
    },
  },
  planetaryIncomeReciprocalMultiplier: {
    name: "Planetary Income Reciprocal Multiplier",
    apply: function (e, r, o) {
      SharkGame.World.worldResources[r].incomeMultiplier = 1 / (e * o);
    },
  },
  planetaryResourceBoost: {
    name: "Planetary Boost",
    apply: function (e, r, o) {
      SharkGame.World.worldResources[r].boostMultiplier = e * o;
    },
  },
  planetaryResourceReciprocalBoost: {
    name: "Planetary Reciprocal Boost",
    apply: function (e, r, o) {
      SharkGame.World.worldResources[r].boostMultiplier = e * o;
    },
  },
  planetaryStartingResources: {
    name: "Planetary Starting Resources",
    apply: function (e, r, o) {
      var a = e * o;
      SharkGame.Resources.getTotalResource(r) < a &&
        SharkGame.Resources.changeResource(r, a);
    },
  },
}),
  (SharkGame.World = {
    worldType: "start",
    worldResources: {},
    planetLevel: 1,
    init: function () {
      SharkGame.World.resetWorldProperties();
    },
    apply: function () {
      var e = SharkGame.World;
      e.applyWorldProperties(e.planetLevel), e.applyGateCosts(e.planetLevel);
    },
    resetWorldProperties: function () {
      var e = SharkGame.World.worldResources,
        r = SharkGame.ResourceTable;
      $.each(r, function (r, o) {
        (e[r] = {}),
          (e[r].exists = !0),
          (e[r].income = 0),
          (e[r].incomeMultiplier = 1),
          (e[r].boostMultiplier = 1),
          (e[r].artifactMultiplier = 1);
      });
    },
    applyWorldProperties: function (e) {
      var r = SharkGame.World,
        o = r.worldResources,
        a = SharkGame.WorldTypes[r.worldType],
        t = r.getTerraformMultiplier(),
        l = Math.max(Math.floor(e * t), 1);
      $.each(a.absentResources, function (e, r) {
        o[r].exists = !1;
      }),
        _.each(a.modifiers, function (e) {
          if (SharkGame.Resources.isCategory(e.resource)) {
            var r = SharkGame.Resources.getResourcesInCategory(e.resource);
            _.each(r, function (r) {
              SharkGame.WorldModifiers[e.modifier].apply(l, r, e.amount);
            });
          } else
            SharkGame.WorldModifiers[e.modifier].apply(l, e.resource, e.amount);
        });
    },
    applyGateCosts: function (e) {
      var r = SharkGame.World,
        o = (SharkGame.Gate, SharkGame.WorldTypes[r.worldType]),
        a = r.getGateCostMultiplier();
      SharkGame.Gate.createSlots(o.gateCosts, r.planetLevel, a);
    },
    getWorldEntryMessage: function () {
      var e = SharkGame.World;
      return SharkGame.WorldTypes[e.worldType].entry;
    },
    doesResourceExist: function (e) {
      return SharkGame.World.worldResources[e].exists;
    },
    forceExistence: function (e) {
      SharkGame.World.worldResources[e].exists = !0;
    },
    getWorldIncomeMultiplier: function (e) {
      return SharkGame.World.worldResources[e].incomeMultiplier;
    },
    getWorldBoostMultiplier: function (e) {
      return SharkGame.World.worldResources[e].boostMultiplier;
    },
    getArtifactMultiplier: function (e) {
      return SharkGame.World.worldResources[e].artifactMultiplier;
    },
    getTerraformMultiplier: function () {
      var e = SharkGame.Artifacts.planetTerraformer.level;
      return e > 0 ? Math.pow(0.9, e) : 1;
    },
    getGateCostMultiplier: function () {
      var e = SharkGame.Artifacts.gateCostReducer.level;
      return e > 0 ? Math.pow(0.9, e) : 1;
    },
  });
