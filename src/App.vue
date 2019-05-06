<template>
  <div>
    <div v-for="(line, index) in lines" v-bind:key="index" class="row" style="margin-top:20px">
      <div class="col-sm-4"></div>
      <div class="col-sm-4">
        <div class="row">
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-1">
                <b-button
                  variant="light"
                  @click="removeLine(index)"
                  style="background:white; border:white"
                >X</b-button>
              </div>
              <div class="col-sm-11">
                <b-input v-model="line.title" placeholder="Type a Goal Title"/>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-1"></div>
              <div class="col-sm-11">
                <b-form-textarea
                  id="textarea"
                  v-model="line.description"
                  placeholder="Type Goal Descreption"
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="row" style="margin-top:20px">
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-1"></div>
              <div class="col-sm-11">
                <b-button
                  v-if="index + 1 === lines.length"
                  @click="addLine(false)"
                  variant="danger"
                >Add new Goal</b-button>
                <b-button variant="success" v-if="index + 1 === lines.length" @click="save()">Save</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4"></div>
    </div>
  </div>
</template>

<script>
import goals from "./store/goals";
export default {
  name: "app",
  data() {
    return {
      options: {
        okText: "Okay"
      },
      goalsList: null,
      lines: [],
      blockRemoval: true
    };
  },

  watch: {
    lines() {
      this.blockRemoval = this.lines.length <= 1;
    }
  },
  methods: {
    addLine(ifMounted) {
      if (!ifMounted) {
        let checkEmptyLines = this.lines.filter(line => line.title === null);
        if (checkEmptyLines.length >= 1 && this.lines.length > 0) return;
        this.lines.push({
          title: null,
          description: null
        });
      } else {
        let checkEmptyLines = this.lines.filter(line => line.title === null);
        if (checkEmptyLines.length >= 1 && this.lines.length > 0) return;
        for (var i = 0; i < this.goalsList.length; i++) {
          this.lines.push({
            title: this.goalsList[i].title,
            description: this.goalsList[i].description
          });
        }
      }
    },
    removeLine(lineId) {
      goals
        .deleteGoal()
        .then(res => {
          this.$dialog.alert(res.data.message, this.options);
        })
        .catch(error => {
          this.$dialog.alert(
            "Something went wrong while deleting the goal!",
            this.options
          );
        });
      if (!this.blockRemoval) this.lines.splice(lineId, 1);
      else {
        this.lines[lineId].title = "";
        this.lines[lineId].description = "";
      }
    },
    save() {
      if (!!this.lines[this.lines.length - 1].title) {
        goals
          .postGoal()
          .then(res => {
            this.$dialog.alert(res.data.message, this.options);
          })
          .catch(error => {
            this.$dialog.alert(
              "Something went wrong while saving the goals!",
              this.options
            );
          });
      } else {
        this.$dialog.alert("Goal Title can not be blank", this.options);
      }
    }
  },
  mounted() {
    goals
      .getGoals()
      .then(res => {
        this.goalsList = res.data.data;
        this.addLine(true);
      })
      .catch(error => {
        this.$dialog.alert(
          "Something went wrong while fetching the goals!",
          this.options
        );
      });
  }
};
</script>