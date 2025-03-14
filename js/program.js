// program.js - Complete strength program data

// Program data structure
const programData = {
    // Default PRs: 
    defaultPRs: {
      benchPress: 245,
      backSquat: 305,
      frontSquat: 245,
      deadlift: 415,
      strictPress: 160,
      splitJerk: 245
    },
    
    // Program structure
    phases: [
      { name: "Hypertrophy", weeks: [1, 2, 3, 13, 14, 15], intensity: [0.72, 0.75, 0.78] },
      { name: "Strength", weeks: [4, 5, 6, 16, 17, 18], intensity: [0.77, 0.82, 0.87] },
      { name: "Deload", weeks: [7, 19], intensity: [0.60] },
      { name: "Peaking", weeks: [8, 9, 10, 20, 21, 22], intensity: [0.82, 0.87, 0.92] },
      { name: "Pre-Test", weeks: [11, 23], intensity: [0.85] },
      { name: "Testing", weeks: [12, 24], intensity: [1.0] }
    ],
    
    // Phase descriptions
    phaseDescriptions: {
      "Hypertrophy": "Focus on building muscle with moderate weight and higher reps. Control the eccentric phase of each lift.",
      "Strength": "Focus on developing maximal strength with heavier weights and moderate reps. Emphasize proper technique.",
      "Deload": "Recovery week with reduced volume and intensity. Focus on movement quality and technique.",
      "Peaking": "Preparing for maximal performance with heavy weights and lower reps. Focus on bar speed and power.",
      "Pre-Test": "Final preparation before PR testing. Reduced volume with maintained intensity to prime the nervous system.",
      "Testing": "PR testing week. Focus on maximal effort for main lifts with proper warm-up and rest between attempts."
    },
    
    // Generate workout template based on phase and week
    generateWorkout: function(week, day, prs) {
      week = parseInt(week, 10);
      day = parseInt(day, 10);
      // Determine phase and intensity for the week
      const phase = this.getPhaseForWeek(week);
      let intensity = this.getIntensityForWeek(week);
      
      // Account for second macrocycle intensity increase
      if (week > 12 && week < 24) {
        intensity += 0.025;
      }
      
      // Get workout template based on day
      switch(day) {
        case 1: return this.generateSquatDay(week, phase, intensity, prs);
        case 2: return this.generatePressDay(week, phase, intensity, prs);
        case 3: return this.generateDeadliftDay(week, phase, intensity, prs);
        case 4: return this.generateBenchDay(week, phase, intensity, prs);
        default: return null;
      }
    },
    
    // Get phase for a specific week
    getPhaseForWeek: function(week) {
      for (const phase of this.phases) {
        if (phase.weeks.includes(parseInt(week))) {
          return phase.name;
        }
      }
      return "Unknown";
    },
    
    // Get intensity for a specific week
    getIntensityForWeek: function(week) {
      week = parseInt(week);
      for (const phase of this.phases) {
        if (phase.weeks.includes(week)) {
          let weekIndex;
          if (week <= 12) {
            weekIndex = phase.weeks.indexOf(week) % phase.intensity.length;
          } else {
            // For second macrocycle, calculate corresponding week in first cycle
            const correspondingWeek = week - 12;
            weekIndex = phase.weeks.indexOf(correspondingWeek) % phase.intensity.length;
          }
          return phase.intensity[weekIndex] || phase.intensity[0];
        }
      }
      return 0.7; // Default intensity
    },
    
    // Helper for squat day workouts
    generateSquatDay: function(week, phase, intensity, prs) {
      const workout = {
        title: "Squat Day",
        phase: phase,
        warmup: [
          "Bike × 5:00",
          "5/5 Forward Lunges",
          "5/5 Lateral Lunges",
          "5/5 Backwards Lunges",
          ":45/:45 Pigeon Stretch",
          "10 Air Squats",
          "10/10 Banded Monster Walks"
        ],
        mainLifts: [],
        accessoryWork: [],
        notes: []
      };
      
      // Configure workout based on phase
      if (phase === "Deload") {
        workout.mainLifts = [
          {
            name: "Back Squat",
            sets: 3,
            reps: 5,
            percentOfMax: 0.6,
            prReference: "backSquat",
            notes: "Focus on technique and recovery"
          },
          {
            name: "Front Squat",
            sets: 2,
            reps: 5,
            percentOfMax: 0.55,
            prReference: "frontSquat",
            notes: "Light weight, perfect form"
          }
        ];
        
        workout.accessoryWork = [
          {
            name: "Walking Lunges",
            sets: 2,
            reps: "8/8",
            intensity: "Light",
            notes: "Focus on form"
          },
          {
            name: "Romanian Deadlift",
            sets: 2,
            reps: 8,
            intensity: "Light",
            notes: "Maintain neutral spine"
          },
          {
            name: "Single Leg Glute Bridge",
            sets: 2,
            reps: "10/10",
            intensity: "",
            notes: "Squeeze at top"
          }
        ];
        
        workout.notes = [
          "This is a deload week. Focus on recovery, technique refinement, and quality movement patterns.",
          "Keep weights light and avoid training to failure. Prioritize recovery for the next training block."
        ];
      }
      else if (phase === "Testing") {
        workout.mainLifts = [
          {
            name: "BACK SQUAT PR PROTOCOL",
            sets: [
              { setNum: 1, reps: 5, percentOfMax: 0.45, prReference: "backSquat", notes: "Warm-up" },
              { setNum: 2, reps: 3, percentOfMax: 0.65, prReference: "backSquat", notes: "Warm-up" },
              { setNum: 3, reps: 2, percentOfMax: 0.75, prReference: "backSquat", notes: "Warm-up" },
              { setNum: 4, reps: 1, percentOfMax: 0.85, prReference: "backSquat", notes: "First working set" },
              { setNum: 5, reps: 1, percentOfMax: 0.9, prReference: "backSquat", notes: "Second working set" },
              { setNum: 6, reps: 1, percentOfMax: 0.95, prReference: "backSquat", notes: "Third working set" },
              { setNum: 7, reps: 1, percentOfMax: 1.0, prReference: "backSquat", notes: "Current PR" },
              { setNum: 8, reps: 1, percentOfMax: 1.025, prReference: "backSquat", notes: "New PR attempt" }
            ],
            isTestProtocol: true
          },
          {
            name: "FRONT SQUAT PR PROTOCOL",
            sets: [
              { setNum: 1, reps: 5, percentOfMax: 0.45, prReference: "frontSquat", notes: "Warm-up" },
              { setNum: 2, reps: 3, percentOfMax: 0.65, prReference: "frontSquat", notes: "Warm-up" },
              { setNum: 3, reps: 2, percentOfMax: 0.75, prReference: "frontSquat", notes: "Warm-up" },
              { setNum: 4, reps: 1, percentOfMax: 0.85, prReference: "frontSquat", notes: "First working set" },
              { setNum: 5, reps: 1, percentOfMax: 0.9, prReference: "frontSquat", notes: "Second working set" },
              { setNum: 6, reps: 1, percentOfMax: 0.95, prReference: "frontSquat", notes: "Third working set" },
              { setNum: 7, reps: 1, percentOfMax: 1.0, prReference: "frontSquat", notes: "Current PR" },
              { setNum: 8, reps: 1, percentOfMax: 1.025, prReference: "frontSquat", notes: "New PR attempt" }
            ],
            isTestProtocol: true
          }
        ];
        
        workout.notes = [
          "PR TESTING PROTOCOL:",
          "- Warm up thoroughly with gradually increasing weights",
          "- Take 3-5 minutes rest between sets above 85% of 1RM",
          "- Have a spotter available for safety",
          "- Listen to your body - if a weight feels too heavy, don't risk injury",
          "- Record your PR attempts in the PR Tracker"
        ];
      }
      else if (phase === "Pre-Test") {
        workout.mainLifts = [
          {
            name: "Back Squat",
            sets: 3,
            reps: 2,
            percentOfMax: 0.85,
            prReference: "backSquat",
            notes: "Focus on perfect technique, 3 min rest"
          },
          {
            name: "Front Squat",
            sets: 2,
            reps: 2,
            percentOfMax: 0.8,
            prReference: "frontSquat",
            notes: "Maintain proper positioning"
          }
        ];
        
        workout.accessoryWork = [
          {
            name: "Walking Lunges",
            sets: 2,
            reps: "6/6",
            intensity: "Medium",
            notes: "Focus on quality"
          },
          {
            name: "Romanian Deadlift",
            sets: 2,
            reps: 6,
            intensity: "Medium",
            notes: "Perfect technique"
          },
          {
            name: "Leg Press",
            sets: 2,
            reps: 6,
            intensity: "Medium",
            notes: "Controlled movements"
          }
        ];
        
        workout.notes = [
          "This is the pre-test week. Focus on movement quality and practicing your setup for next week's PR attempts.",
          "Keep volume low and prioritize recovery. Concentrate on perfect technique with submaximal weights."
        ];
      }
      else if (phase === "Hypertrophy") {
        const weekInMeso = (parseInt(week) <= 3) ? parseInt(week) : (parseInt(week) - 12);
        const reps = 10 - ((weekInMeso - 1) * 2); // 10->8->6
        
        workout.mainLifts = [
          {
            name: "Back Squat",
            sets: 4,
            reps: reps,
            percentOfMax: intensity,
            prReference: "backSquat",
            notes: "Control eccentric, 2 min rest"
          },
          {
            name: "Front Squat",
            sets: 3,
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "frontSquat",
            notes: "Stay upright, brace core"
          }
        ];
        
        const accReps = 12 - ((weekInMeso - 1) * 2); // 12->10->8
        const accIntensity = weekInMeso === 1 ? "Medium" : "Hard";
        
        workout.accessoryWork = [
          {
            name: "Bulgarian Split Squat",
            sets: 3,
            reps: `${accReps}/${accReps}`,
            intensity: accIntensity,
            notes: "Control the movement"
          },
          {
            name: "Romanian Deadlift",
            sets: 3,
            reps: accReps,
            intensity: accIntensity,
            notes: "Hamstring stretch focus"
          },
          {
            name: "Single Leg Glute Bridge",
            sets: 3,
            reps: `${accReps + 3}/${accReps + 3}`,
            intensity: "",
            notes: "Full hip extension"
          },
          {
            name: "Seated Calf Raise",
            sets: 3,
            reps: accReps + 3,
            intensity: accIntensity,
            notes: "Full range of motion"
          }
        ];
        
        workout.notes = [
          "HYPERTROPHY PHASE FOCUS:",
          "- Control the eccentric (lowering) portion of each lift for 2-3 seconds",
          "- Focus on muscle tension throughout each repetition",
          "- Rest 90-120 seconds between main lift sets, 60-90 seconds for accessories",
          "- Aim for quality repetitions rather than maximal weight"
        ];
      }
      else if (phase === "Strength") {
        const weekInMeso = (parseInt(week) <= 6) ? (parseInt(week) - 3) : (parseInt(week) - 15);
        const reps = 6 - (weekInMeso - 1); // 6->5->4
        const pauseReps = 4 - (weekInMeso - 1); // 4->3->2
        
        workout.mainLifts = [
          {
            name: "Back Squat",
            sets: 4,
            reps: reps,
            percentOfMax: intensity,
            prReference: "backSquat",
            notes: "Explosive out of hole, 2-3 min rest"
          },
          {
            name: "Pause Back Squat",
            sets: 3,
            reps: pauseReps,
            percentOfMax: intensity - 0.05,
            prReference: "backSquat",
            notes: "2 sec pause at bottom"
          }
        ];
        
        const accReps = 8 - weekInMeso; // 8->7->6
        
        workout.accessoryWork = [
          {
            name: "Barbell Forward Lunge",
            sets: 3,
            reps: `${accReps}/${accReps}`,
            intensity: "Hard",
            notes: "Maintain balance"
          },
          {
            name: "Good Mornings",
            sets: 3,
            reps: accReps,
            intensity: "Hard",
            notes: "Brace core properly"
          },
          {
            name: "Single Leg Glute Bridge",
            sets: 3,
            reps: `${accReps + 4}/${accReps + 4}`,
            intensity: "",
            notes: "Control throughout"
          },
          {
            name: "Walking Kettlebell Lunge",
            sets: 3,
            reps: `${accReps + 2}/${accReps + 2}`,
            intensity: "Hard",
            notes: "Keep torso upright"
          }
        ];
        
        workout.notes = [
          "STRENGTH PHASE FOCUS:",
          "- Focus on developing tension and force production",
          "- Maintain perfect position throughout lifts",
          "- Rest 2-3 minutes between main lift sets, 90-120 seconds for accessories",
          "- Concentrate on bar speed on the concentric (lifting) portion"
        ];
      }
      else if (phase === "Peaking") {
        const weekInMeso = (parseInt(week) <= 10) ? (parseInt(week) - 7) : (parseInt(week) - 19);
        const reps = 5 - weekInMeso; // 5->4->3
        const sets = 5 - (weekInMeso - 1); // 5->4->3
        
        workout.mainLifts = [
          {
            name: "Back Squat",
            sets: sets,
            reps: reps,
            percentOfMax: intensity,
            prReference: "backSquat",
            notes: "Maximum force production, 3 min rest"
          }
        ];
        
        if (weekInMeso < 3) { // Only for first two weeks of peaking
          workout.mainLifts.push({
            name: "Front Squat",
            sets: 3,
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "frontSquat",
            notes: "Perfect position, powerful drive"
          });
          
          workout.mainLifts.push({
            name: "Box Squat",
            sets: 2,
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "backSquat",
            notes: "Explosive off box"
          });
        } else {
          workout.mainLifts.push({
            name: "Front Squat",
            sets: 2,
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "frontSquat",
            notes: "Speed and power focus"
          });
        }
        
        const accReps = 8 - (weekInMeso * 2); // 8->6->4
        const accSets = 3 - (weekInMeso - 1);
        
        workout.accessoryWork = [
          {
            name: "Walking Lunges",
            sets: accSets,
            reps: `${accReps}/${accReps}`,
            intensity: "Hard",
            notes: "Explosive step"
          },
          {
            name: "Good Mornings",
            sets: accSets,
            reps: accReps,
            intensity: "Hard",
            notes: "Maintain rigid back"
          },
          {
            name: "Leg Press",
            sets: accSets,
            reps: accReps,
            intensity: "Hard",
            notes: "Focus on quad drive"
          }
        ];
        
        workout.notes = [
          "PEAKING PHASE FOCUS:",
          "- Emphasize bar speed on concentric portion",
          "- Generate maximum force from the start of each lift",
          "- Rest 3-4 minutes between main lift sets, 2 minutes for accessories",
          "- Focus on perfect technique even as weights get heavier"
        ];
      }
      
      return workout;
    },
    
    // Helper for press day workouts
    generatePressDay: function(week, phase, intensity, prs) {
      const workout = {
        title: "Press Day",
        phase: phase,
        warmup: [
          "Jump Rope × 2:00",
          "10 Push-ups",
          ":45/:45 Banded Lat Stretch",
          "15 Banded Pull-aparts",
          ":45/:45 Doorway Pec Stretch",
          "10 Banded Face Pulls"
        ],
        mainLifts: [],
        accessoryWork: [],
        notes: []
      };
      
      // Configure workout based on phase
      if (phase === "Deload") {
        workout.mainLifts = [
          {
            name: "Strict Press",
            sets: 3,
            reps: 5,
            percentOfMax: 0.6,
            prReference: "strictPress",
            notes: "Focus on technique and recovery"
          },
          {
            name: "Push Press",
            sets: 2,
            reps: 3,
            percentOfMax: 0.6,
            prReference: "splitJerk",
            notes: "Light weight, perfect form"
          }
        ];
        
        workout.accessoryWork = [
          {
            name: "Dumbbell Lateral Raise",
            sets: 2,
            reps: 10,
            intensity: "Light",
            notes: "Controlled movement"
          },
          {
            name: "Barbell Row",
            sets: 2,
            reps: 8,
            intensity: "Light",
            notes: "Maintain neutral spine"
          },
          {
            name: "Tricep Dips",
            sets: 2,
            reps: 8,
            intensity: "",
            notes: "Full range of motion"
          },
          {
            name: "Hammer Curl",
            sets: 2,
            reps: 10,
            intensity: "Light",
            notes: "Bicep/forearm development"
          }
        ];
        
        workout.notes = [
          "This is a deload week. Focus on recovery, technique refinement, and quality movement patterns.",
          "Keep weights light and avoid training to failure. Prioritize recovery for the next training block."
        ];
      }
      else if (phase === "Testing") {
        workout.mainLifts = [
          {
            name: "STRICT PRESS PR PROTOCOL",
            sets: [
              { setNum: 1, reps: 5, percentOfMax: 0.45, prReference: "strictPress", notes: "Warm-up" },
              { setNum: 2, reps: 3, percentOfMax: 0.65, prReference: "strictPress", notes: "Warm-up" },
              { setNum: 3, reps: 2, percentOfMax: 0.75, prReference: "strictPress", notes: "Warm-up" },
              { setNum: 4, reps: 1, percentOfMax: 0.85, prReference: "strictPress", notes: "First working set" },
              { setNum: 5, reps: 1, percentOfMax: 0.9, prReference: "strictPress", notes: "Second working set" },
              { setNum: 6, reps: 1, percentOfMax: 0.95, prReference: "strictPress", notes: "Third working set" },
              { setNum: 7, reps: 1, percentOfMax: 1.0, prReference: "strictPress", notes: "Current PR" },
              { setNum: 8, reps: 1, percentOfMax: 1.03, prReference: "strictPress", notes: "New PR attempt" }
            ],
            isTestProtocol: true
          },
          {
            name: "PUSH PRESS/JERK PR PROTOCOL",
            sets: [
              { setNum: 1, reps: 5, percentOfMax: 0.45, prReference: "splitJerk", notes: "Warm-up" },
              { setNum: 2, reps: 3, percentOfMax: 0.65, prReference: "splitJerk", notes: "Warm-up" },
              { setNum: 3, reps: 2, percentOfMax: 0.75, prReference: "splitJerk", notes: "Warm-up" },
              { setNum: 4, reps: 1, percentOfMax: 0.85, prReference: "splitJerk", notes: "First working set" },
              { setNum: 5, reps: 1, percentOfMax: 0.9, prReference: "splitJerk", notes: "Second working set" },
              { setNum: 6, reps: 1, percentOfMax: 0.95, prReference: "splitJerk", notes: "Third working set" },
              { setNum: 7, reps: 1, percentOfMax: 1.0, prReference: "splitJerk", notes: "Current PR" },
              { setNum: 8, reps: 1, percentOfMax: 1.03, prReference: "splitJerk", notes: "New PR attempt" }
            ],
            isTestProtocol: true
          }
        ];
        
        workout.notes = [
          "PR TESTING PROTOCOL:",
          "- Warm up thoroughly with gradually increasing weights",
          "- Take 3-5 minutes rest between sets above 85% of 1RM",
          "- Maintain perfect technique even at maximal weights",
          "- Listen to your body - if a weight feels too heavy, don't risk injury",
          "- Record your PR attempts in the PR Tracker"
        ];
      }
      else if (phase === "Pre-Test") {
        workout.mainLifts = [
          {
            name: "Strict Press",
            sets: 3,
            reps: 2,
            percentOfMax: 0.85,
            prReference: "strictPress",
            notes: "Focus on perfect technique"
          },
          {
            name: "Push Press",
            sets: 2,
            reps: 1,
            percentOfMax: 0.9,
            prReference: "splitJerk",
            notes: "Practice your setup"
          }
        ];
        
        workout.accessoryWork = [
          {
            name: "Seated Dumbbell Press",
            sets: 2,
            reps: 5,
            intensity: "Medium",
            notes: "Focus on quality"
          },
          {
            name: "Barbell Row",
            sets: 2,
            reps: 5,
            intensity: "Medium",
            notes: "Perfect technique"
          },
          {
            name: "Dips",
            sets: 2,
            reps: 5,
            intensity: "Weighted",
            notes: "Controlled movements"
          },
          {
            name: "Hammer Curl",
            sets: 2,
            reps: 5,
            intensity: "Medium",
            notes: "Bicep activation"
          }
        ];
        
        workout.notes = [
          "This is the pre-test week. Focus on movement quality and practicing your setup for next week's PR attempts.",
          "Keep volume low and prioritize recovery. Concentrate on perfect technique with submaximal weights."
        ];
      }
      else if (phase === "Hypertrophy") {
        const weekInMeso = (parseInt(week) <= 3) ? parseInt(week) : (parseInt(week) - 12);
        const reps = 8 - ((weekInMeso - 1) * 1); // 8->7->6
        const pushReps = 6 - ((weekInMeso - 1) * 1); // 6->5->4
        
        workout.mainLifts = [
          {
            name: "Strict Press",
            sets: 4,
            reps: reps,
            percentOfMax: intensity,
            prReference: "strictPress",
            notes: "Control eccentric, 2 min rest"
          },
          {
            name: "Push Press",
            sets: 3,
            reps: pushReps,
            percentOfMax: intensity + 0.05,
            prReference: "splitJerk",
            notes: "Drive with legs, fast press"
          }
        ];
        
        const accReps = 12 - ((weekInMeso - 1) * 1); // 12->11->10
        const accIntensity = weekInMeso === 1 ? "Medium" : "Hard";
        
        workout.accessoryWork = [
          {
            name: "Dumbbell Lateral Raise",
            sets: 3,
            reps: accReps,
            intensity: accIntensity,
            notes: "Shoulder isolation"
          },
          {
            name: "Barbell Front Raise",
            sets: 3,
            reps: accReps,
            intensity: accIntensity,
            notes: "Anterior delt focus"
          },
          {
            name: "JM Press",
            sets: 3,
            reps: accReps - 2,
            intensity: accIntensity,
            notes: "Tricep development"
          },
          {
            name: "Dumbbell Reverse Fly",
            sets: 3,
            reps: accReps,
            intensity: accIntensity,
            notes: "Rear delt focus"
          },
          {
            name: "Hammer Curl to Overhead Press",
            sets: 3,
            reps: accReps - 2,
            intensity: accIntensity,
            notes: "Smooth transition"
          }
        ];
        
        workout.notes = [
          "HYPERTROPHY PHASE FOCUS:",
          "- Control the eccentric (lowering) portion of each lift for 2-3 seconds",
          "- Focus on muscle tension throughout each repetition",
          "- Rest 90-120 seconds between main lift sets, 60-90 seconds for accessories",
          "- Aim for quality repetitions rather than maximal weight"
        ];
      }
      else if (phase === "Strength") {
        const weekInMeso = (parseInt(week) <= 6) ? (parseInt(week) - 3) : (parseInt(week) - 15);
        const reps = 6 - (weekInMeso - 1); // 6->5->4
        const pushReps = 4 - (weekInMeso - 1); // 4->3->2
        
        workout.mainLifts = [
          {
            name: "Strict Press",
            sets: 4,
            reps: reps,
            percentOfMax: intensity,
            prReference: "strictPress",
            notes: "Tight core, 2-3 min rest"
          },
          {
            name: "Push Press",
            sets: 3,
            reps: pushReps,
            percentOfMax: intensity + 0.05,
            prReference: "splitJerk",
            notes: "Explosive drive"
          }
        ];
        
        const accReps = 8 - weekInMeso; // 8->7->6
        
        workout.accessoryWork = [
          {
            name: "Z Press",
            sets: 3,
            reps: accReps,
            intensity: "Hard",
            notes: "Seated on floor, legs extended"
          },
          {
            name: "Dumbbell Arnold Press",
            sets: 3,
            reps: accReps + 2,
            intensity: "Hard",
            notes: "Full rotation"
          },
          {
            name: "Barbell Row",
            sets: 3,
            reps: accReps,
            intensity: "Hard",
            notes: "Controlled eccentric"
          },
          {
            name: "Tricep Dips",
            sets: 3,
            reps: accReps + 4,
            intensity: weekInMeso > 1 ? "Weighted" : "",
            notes: "Full range of motion"
          },
          {
            name: "Hammer Curl",
            sets: 3,
            reps: accReps + 2,
            intensity: "Hard",
            notes: "Bicep focus"
          }
        ];
        
        workout.notes = [
          "STRENGTH PHASE FOCUS:",
          "- Focus on developing pressing power and leg drive",
          "- Maintain perfect bar path",
          "- Rest 2-3 minutes between main lift sets, 90-120 seconds for accessories",
          "- Concentrate on technique as weights increase"
        ];
      }
      else if (phase === "Peaking") {
        const weekInMeso = (parseInt(week) <= 10) ? (parseInt(week) - 7) : (parseInt(week) - 19);
        const reps = 4 - weekInMeso; // 4->3->2
        const sets = 5 - (weekInMeso - 1); // 5->4->3
        
        workout.mainLifts = [
          {
            name: "Bench Press",
            sets: sets,
            reps: reps,
            percentOfMax: intensity,
            prReference: "benchPress",
            notes: "Maximum force, 3 min rest"
          },
          {
            name: "Close Grip Bench Press",
            sets: 4 - (weekInMeso - 1),
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "benchPress",
            // Fixed quotes in the notes below:
            notes: 'Pause 1" above chest'
          }
        ];
        
        if (weekInMeso < 3) { // Only for first two weeks of peaking
          workout.mainLifts.push({
            name: "Floor Press",
            sets: 3 - (weekInMeso - 1),
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "benchPress",
            notes: "Eliminate leg drive"
          });
        }
        
        const accReps = 8 - (weekInMeso * 1); // 8->7->6
        const accSets = 3 - (weekInMeso - 1);
        
        workout.accessoryWork = [
          {
            name: "Dumbbell Incline Press",
            sets: accSets,
            reps: accReps - 2,
            intensity: "Hard",
            notes: "Upper chest power"
          },
          {
            name: "Dumbbell Row",
            sets: accSets,
            reps: `${accReps - 2}/${accReps - 2}`,
            intensity: "Hard",
            notes: "Back strength"
          },
          {
            name: "Skull Crushers",
            sets: accSets,
            reps: accReps - 2,
            intensity: "Hard",
            notes: "Tricep strength"
          },
          {
            name: "Weighted Dips",
            sets: accSets,
            reps: accReps - 2,
            intensity: "",
            notes: "Add weight if possible"
          }
        ];
        
        workout.notes = [
          "PEAKING PHASE FOCUS:",
          "- Emphasize bar speed on concentric portion",
          "- Focus on generating maximum force",
          "- Rest 3 minutes between main lift sets, 2 minutes for accessories",
          "- Perfect your competition setup and execution"
        ];
      }
      
      return workout;
    },

    generateDeadliftDay: function(week, phase, intensity, prs) {
      const workout = {
        title: "Deadlift Day",
        phase: phase,
        warmup: [
          "Bike × 5:00",
          "10 Cat-Cow Stretches",
          "10 Glute Bridges",
          "10 Bird Dogs (each side)",
          "10 Banded Good Mornings",
          "Hip Flexor Stretch: 30s each side",
          "10 Light KB Swings"
        ],
        mainLifts: [],
        accessoryWork: [],
        notes: []
      };
      
      if (phase === "Deload") {
        workout.mainLifts = [
          {
            name: "Deadlift",
            sets: 3,
            reps: 5,
            percentOfMax: 0.6,
            prReference: "deadlift",
            notes: "Focus on technique and recovery"
          }
        ];
        
        workout.accessoryWork = [
          {
            name: "Romanian Deadlift",
            sets: 2,
            reps: 8,
            intensity: "Light",
            notes: "Maintain neutral spine"
          },
          {
            name: "Single-Leg RDL",
            sets: 2,
            reps: "8/8",
            intensity: "Light",
            notes: "Focus on balance"
          }
        ];
        
        workout.notes = [
          "Deload week: Focus on recovery and technique refinement.",
          "Keep weights light and avoid training to failure."
        ];
      } 
      else if (phase === "Testing") {
        workout.mainLifts = [
          {
            name: "DEADLIFT PR PROTOCOL",
            sets: [
              { setNum: 1, reps: 5, percentOfMax: 0.45, prReference: "deadlift", notes: "Warm-up" },
              { setNum: 2, reps: 3, percentOfMax: 0.65, prReference: "deadlift", notes: "Warm-up" },
              { setNum: 3, reps: 2, percentOfMax: 0.75, prReference: "deadlift", notes: "Warm-up" },
              { setNum: 4, reps: 1, percentOfMax: 0.85, prReference: "deadlift", notes: "First working set" },
              { setNum: 5, reps: 1, percentOfMax: 0.9, prReference: "deadlift", notes: "Second working set" },
              { setNum: 6, reps: 1, percentOfMax: 0.95, prReference: "deadlift", notes: "Third working set" },
              { setNum: 7, reps: 1, percentOfMax: 1.0, prReference: "deadlift", notes: "Current PR" },
              { setNum: 8, reps: 1, percentOfMax: 1.025, prReference: "deadlift", notes: "New PR attempt" }
            ],
            isTestProtocol: true
          }
        ];
        
        workout.notes = [
          "PR TESTING PROTOCOL:",
          "- Warm up thoroughly with gradually increasing weights",
          "- Take 3-5 minutes rest between sets above 85% of 1RM",
          "- Have a spotter available for safety",
          "- Record your PR attempts in the PR Tracker"
        ];
      }
      else if (phase === "Hypertrophy") {
        const weekInMeso = (parseInt(week) <= 3) ? parseInt(week) : (parseInt(week) - 12);
        const reps = 10 - ((weekInMeso - 1) * 2); // 10->8->6
        
        workout.mainLifts = [
          {
            name: "Deadlift",
            sets: 4,
            reps: reps,
            percentOfMax: intensity,
            prReference: "deadlift",
            notes: "Control eccentric, 2 min rest"
          }
        ];
        
        const accReps = 12 - ((weekInMeso - 1) * 2); // 12->10->8
        
        workout.accessoryWork = [
          {
            name: "Barbell Row",
            sets: 3,
            reps: accReps,
            intensity: "Medium-Heavy",
            notes: "Control the eccentric"
          },
          {
            name: "Pull-ups",
            sets: 3,
            reps: "AMRAP",
            intensity: "Bodyweight",
            notes: "Use assistance if needed"
          },
          {
            name: "Hyperextensions",
            sets: 3,
            reps: accReps + 2,
            intensity: "Light-Medium",
            notes: "Full range of motion"
          }
        ];
        
        workout.notes = [
          "HYPERTROPHY PHASE FOCUS:",
          "- Control the eccentric portion of each lift",
          "- Focus on muscle tension throughout each repetition",
          "- Rest 90-120 seconds between main lift sets"
        ];
      }
      else if (phase === "Strength" || phase === "Peaking" || phase === "Pre-Test") {
        // Add appropriate content similar to other workout generators
        // This follows the same pattern as the squat/press day functions
        const weekInMeso = (parseInt(week) <= 6) ? (parseInt(week) - 3) : (parseInt(week) - 15);
        const reps = phase === "Strength" ? (6 - (weekInMeso - 1)) : 
                     phase === "Peaking" ? (5 - weekInMeso) :
                     3; // Pre-test
        
        workout.mainLifts = [
          {
            name: "Deadlift",
            sets: phase === "Pre-Test" ? 3 : 4,
            reps: reps,
            percentOfMax: intensity,
            prReference: "deadlift",
            notes: phase === "Pre-Test" ? "Perfect technique, 3 min rest" : 
                   "Explosive concentric, 3 min rest"
          }
        ];
        
        // Add appropriate accessory work
        workout.accessoryWork = [
          {
            name: "Barbell Row",
            sets: 3,
            reps: 6,
            intensity: "Heavy",
            notes: "Upper back strength"
          },
          {
            name: "Pull-ups",
            sets: 3,
            reps: "6-8",
            intensity: "Weighted",
            notes: "Add weight if possible"
          },
          {
            name: "Farmer's Walk",
            sets: 3,
            reps: "40m",
            intensity: "Heavy",
            notes: "Grip strength focus"
          }
        ];
        
        workout.notes = [
          `${phase.toUpperCase()} PHASE FOCUS:`,
          "- Generate maximum force from the floor",
          "- Maintain rigid back position",
          "- Rest 2-3 minutes between sets"
        ];
      }
      
      return workout;
    },

    generateBenchDay: function(week, phase, intensity, prs) {
      const workout = {
        title: "Bench Day",
        phase: phase,
        warmup: [
          "Jump Rope × 2:00",
          "10 Push-ups",
          "10 Band Pull-aparts",
          "10 Shoulder Dislocates",
          "Foam Roll Upper Back",
          "Shoulder Mobility Drill",
          "10 Scap Push-ups"
        ],
        mainLifts: [],
        accessoryWork: [],
        notes: []
      };
      
      if (phase === "Deload") {
        workout.mainLifts = [
          {
            name: "Bench Press",
            sets: 3,
            reps: 5,
            percentOfMax: 0.6,
            prReference: "benchPress",
            notes: "Focus on technique and recovery"
          }
        ];
        
        workout.accessoryWork = [
          {
            name: "Dumbbell Row",
            sets: 2,
            reps: "8/8",
            intensity: "Light",
            notes: "Controlled movement"
          },
          {
            name: "Tricep Pushdown",
            sets: 2,
            reps: 10,
            intensity: "Light",
            notes: "Full extension"
          }
        ];
        
        workout.notes = [
          "This is a deload week. Focus on recovery and technique.",
          "Keep weights light and avoid training to failure."
        ];
      }
      else if (phase === "Testing") {
        workout.mainLifts = [
          {
            name: "BENCH PRESS PR PROTOCOL",
            sets: [
              { setNum: 1, reps: 5, percentOfMax: 0.45, prReference: "benchPress", notes: "Warm-up" },
              { setNum: 2, reps: 3, percentOfMax: 0.65, prReference: "benchPress", notes: "Warm-up" },
              { setNum: 3, reps: 2, percentOfMax: 0.75, prReference: "benchPress", notes: "Warm-up" },
              { setNum: 4, reps: 1, percentOfMax: 0.85, prReference: "benchPress", notes: "First working set" },
              { setNum: 5, reps: 1, percentOfMax: 0.9, prReference: "benchPress", notes: "Second working set" },
              { setNum: 6, reps: 1, percentOfMax: 0.95, prReference: "benchPress", notes: "Third working set" },
              { setNum: 7, reps: 1, percentOfMax: 1.0, prReference: "benchPress", notes: "Current PR" },
              { setNum: 8, reps: 1, percentOfMax: 1.025, prReference: "benchPress", notes: "New PR attempt" }
            ],
            isTestProtocol: true
          }
        ];
        
        workout.notes = [
          "PR TESTING PROTOCOL:",
          "- Warm up thoroughly with gradually increasing weights",
          "- Take 3-5 minutes rest between sets above 85% of 1RM",
          "- Have a spotter available for safety",
          "- Record your PR attempts in the PR Tracker"
        ];
      }
      else if (phase === "Hypertrophy" || phase === "Strength" || phase === "Peaking" || phase === "Pre-Test") {
        // Similar pattern to other workout days
        const weekInMeso = phase === "Hypertrophy" ? 
          ((parseInt(week) <= 3) ? parseInt(week) : (parseInt(week) - 12)) :
          phase === "Strength" ? 
            ((parseInt(week) <= 6) ? (parseInt(week) - 3) : (parseInt(week) - 15)) :
            ((parseInt(week) <= 10) ? (parseInt(week) - 7) : (parseInt(week) - 19));
        
        const reps = phase === "Hypertrophy" ? (10 - ((weekInMeso - 1) * 2)) : // 10->8->6
                  phase === "Strength" ? (6 - (weekInMeso - 1)) : // 6->5->4
                  phase === "Peaking" ? (4 - weekInMeso) : // 4->3->2
                  3; // Pre-Test
        
        workout.mainLifts = [
          {
            name: "Bench Press",
            sets: phase === "Pre-Test" ? 3 : (phase === "Peaking" ? (5 - (weekInMeso - 1)) : 4),
            reps: reps,
            percentOfMax: intensity,
            prReference: "benchPress",
            notes: phase === "Hypertrophy" ? "Control eccentric, 2 min rest" :
                  "Explosive press, tight setup"
          }
        ];
        
        // Add variations based on phase
        if (phase !== "Pre-Test") {
          workout.mainLifts.push({
            name: phase === "Hypertrophy" ? "Incline Bench Press" :
                  phase === "Strength" ? "Close-Grip Bench" : 
                  "Paused Bench Press",
            sets: 3,
            reps: reps,
            percentOfMax: intensity - 0.05,
            prReference: "benchPress",
            notes: phase === "Peaking" ? "2-second pause" : "Full range of motion"
          });
        }
        
        // Add accessories appropriate to the phase
        workout.accessoryWork = [
          {
            name: "Lat Pulldown",
            sets: 3,
            reps: phase === "Hypertrophy" ? 12 : 8,
            intensity: phase === "Hypertrophy" ? "Medium" : "Heavy",
            notes: "Engage lats fully"
          },
          {
            name: "Dumbbell Row",
            sets: 3,
            reps: phase === "Hypertrophy" ? "12/12" : "8/8",
            intensity: phase === "Hypertrophy" ? "Medium" : "Heavy",
            notes: "Upper back focus"
          },
          {
            name: phase === "Peaking" ? "Weighted Dips" : "Dips",
            sets: 3,
            reps: phase === "Hypertrophy" ? 12 : 8,
            intensity: phase === "Peaking" ? "Add weight" : "Bodyweight",
            notes: "Tricep emphasis"
          }
        ];
        
        workout.notes = [
          `${phase.toUpperCase()} PHASE FOCUS:`,
          phase === "Hypertrophy" ? "- Control the eccentric portion of each lift" :
          phase === "Strength" ? "- Focus on bar speed and power" :
          "- Perfect setup and execution",
          "- Maintain tightness throughout the movement",
          `- Rest ${phase === "Hypertrophy" ? "90-120" : phase === "Strength" ? "2-3" : "3"} minutes between main lifts`
        ];
      }
      
      return workout;
    }
  };
    
  // Make program data available globally
  window.programData = programData;