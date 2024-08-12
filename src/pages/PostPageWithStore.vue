<template>
  <div>
    <h1>Страница с постами</h1>
    <my-input
        v-focus
        :model-value="searchQuery"
        @update:model-value="setSearchQuery"
        placeholder="Поиск..."
    />
    <div class="app__btns">
      <my-button
          @click="showDialog"
      >
        Создать пост
      </my-button>
      <my-select
          :model-value="selectedSort"
          @update:model-value="setSelectedSort"
          :options="sortOptions"
      />
    </div>

    <my-dialog v-model:show="dialogVisible">
      <post-form
          @create="createPost"
      />
    </my-dialog>
    <!--    <post-list v-bind:posts="posts"/>-->
    <post-list
        :posts="sortedAndSearchedPosts"
        @remove="removePost"
        v-if="!isPostsLoading"
    />
    <div v-else>
      Идёт загрузка
    </div>
    <div v-intersection="loadMorePosts" class="observer" />
  </div>
</template>

<script>
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from "@/components/UI/MySelect.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {mapState, mapGetters, mapActions, mapMutations} from "vuex";

export default {
  components: {
    MyInput,
    MySelect,
    MyButton,
    PostList, PostForm
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  methods: {
    ...mapMutations({
      setPage: "post/setPage",
      setSearchQuery: "post/setSearchQuery",
      setSelectedSort: "post/setSelectedSort"
    }),
    ...mapActions({
      loadMorePosts: "post/loadMorePosts",
      fetchPosts: "post/fetchPosts",
    }),
    createPost(post) {
      this.posts.push(post);
      this.dialogVisible = false;
    },
    removePost(post) {
      this.posts = this.posts.filter(p => p.id !== post.id)
    },
    showDialog() {
      this.dialogVisible = true;
    },
  },
  // IT'S HOOK BRO
  mounted() {
    this.fetchPosts()
  },
  // watch vs computed
  // computed - cashing information
  watch: {

  },
  computed: {
    ...mapState({
      isPostsLoading: state => state.post.isPostsLoading,
      searchQuery: state => state.post.searchQuery,
      selectedSort: state => state.post.selectedSort,
      sortOptions: state => state.post.sortOptions
    }),
    ...mapGetters({
      sortedPosts: 'post/sortedPosts',
      sortedAndSearchedPosts: 'post/sortedAndSearchedPosts',
    })
  }
}
</script>

<style>


.app__btns {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.page__wrapper {
  display: flex;
  margin-top: 15px;
}

.page {
  border: 1px solid black;
  padding: 10px;
}

.current-page {
  border: 2px solid teal;
}

.observer {
  height: 30px;
  background: green;
}
</style>
