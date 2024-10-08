(SGAI = {}),
  (SGAI.biasedFavourites = {
    fish: 0.1,
    clam: 0,
    sponge: 0.1,
    kelp: 0,
    science: 0,
  }),
  (SGAI.pickBestAction = function () {
    var e = SharkGame.Home,
      a = (SharkGame.Resources, SharkGame.ResourceTable, "none"),
      o = 0;
    return (
      $.each(SharkGame.HomeActions, function (r, t) {
        if (e.areActionPrereqsMet(r)) {
          var c = SGAI.getActionValue(r);
          c > o && ((o = c), (a = r));
        }
      }),
      a
    );
  }),
  (SGAI.getActionValue = function (e) {
    var a = SharkGame.Home,
      o = SharkGame.Resources,
      r = SharkGame.ResourceTable,
      t = SharkGame.HomeActions[e],
      c = a.getMax(t),
      s = a.getCost(t, c),
      i = 0;
    if (o.checkResources(s) && !$.isEmptyObject(s)) {
      var n = 0,
        u = 0;
      $.each(s, function (e, a) {
        n += a * r[e].value;
      });
      var S = t.effect.resource;
      S &&
        $.each(S, function (e, a) {
          var t =
            void 0 !== SGAI.biasedFavourites[e]
              ? SGAI.biasedFavourites[e]
              : r[e].value;
          c * a * t;
          var s = r[e].income;
          s &&
            $.each(s, function (a, t) {
              var s = o.getProductAmountFromGeneratorResource(e, a),
                i =
                  void 0 !== SGAI.biasedFavourites[a]
                    ? SGAI.biasedFavourites[a]
                    : r[a].value;
              u += c * s * i;
            });
        }),
        (i = u / n);
    }
    return i;
  }),
  (SGAI.autopilot = function () {
    setInterval(function () {
      var e = SharkGame.Home,
        a = SharkGame.Log,
        o = SharkGame.Resources,
        r = SGAI.pickBestAction();
      if ("none" !== r) {
        var t = SGAI.getActionValue(r),
          c = SharkGame.HomeActions[r],
          s = e.getMax(c),
          i = e.getCost(c, s);
        if (o.checkResources(i)) {
          o.changeManyResources(i, !0);
          var n = o.scaleResourceList(c.effect.resource, s);
          o.changeManyResources(n),
            a.addMessage(
              "Autopilot: Bought " +
                o.resourceListToString(n) +
                " for " +
                o.resourceListToString(i) +
                ". Calculated gain: " +
                t +
                ".",
            );
        }
      }
    }, 2e3);
  });
