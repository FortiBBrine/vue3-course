<template>
  <div class = "app">
    <h1>Страница с постами</h1>
    <my-input
      v-model="searchQuery"
      placeholder="Поиск..."
    />
    <div class="app__btns">
      <my-button
          @click="showDialog"
      >
        Создать пост
      </my-button>
      <my-select
        v-model="selectedSort"
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
  </div>
</template>

<script>
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import MyButton from "@/components/UI/MyButton.vue";
import axios from "axios";
import MySelect from "@/components/UI/MySelect.vue";
import MyInput from "@/components/UI/MyInput.vue";

export default {
  components: {
    MyInput,
    MySelect,
    MyButton,
      PostList, PostForm
  },
  data() {
    return {
      posts: [],
      dialogVisible: false,
      isPostsLoading: false,
      selectedSort: '',
      sortOptions: [
          {value: 'title', name: 'По названию'},
          {value: 'body', name: 'По описанию'},
      ],
      searchQuery: ''
    }
  },
  methods: {
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
    async fetchPosts() {
      try {
        this.isPostsLoading = true;
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=10");
        this.posts = response.data

      } catch (e) {
        alert("Ошибка")
      } finally {
        this.isPostsLoading = false;
      }
    }
  },
  // IT'S HOOK BRO
  mounted() {
    this.fetchPosts()
  },
  // watch vs computed
  // computed - cashing information
  watch: {
    // selectedSort(newValue) {
    //   this.posts.sort((post1, post2) => {
    //     return post1[newValue]?.localeCompare(post2[newValue]);
    //   })
    // },
    // FOR OBJECTS
    //
    // post: {
    //   handler(newValue) {
    //
    //   },
    //   deep: true
    // }
  },
  computed: {
    sortedPosts() {
      return [...this.posts].sort((post1, post2) => {
        return post1[this.selectedSort]?.localeCompare(post2[this.selectedSort])
      })
    },
    sortedAndSearchedPosts() {
      return this.sortedPosts.filter(post => {
        return post.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  padding: 20px;
}
.app__btns {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}
</style>
