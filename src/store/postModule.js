import axios from "axios";

export const postModule = {
    state: () => ({
        posts: [],
        isPostsLoading: false,
        selectedSort: '',
        sortOptions: [
            {value: 'title', name: 'По названию'},
            {value: 'body', name: 'По описанию'},
        ],
        searchQuery: '',
        page: 1,
        limit: 10,
        totalPages: 0,
    }),
    getters: {
        sortedPosts(state) {
            return [...state.posts].sort((post1, post2) => {
                return post1[state.selectedSort]?.localeCompare(post2[state.selectedSort])
            })
        },
        sortedAndSearchedPosts(state, getters) {
            return getters.sortedPosts.filter(post => {
                return post.title.toLowerCase().includes(state.searchQuery.toLowerCase())
            })
        }
    },
    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },
        setLoading(state, isPostsLoading) {
            state.isPostsLoading = isPostsLoading;
        },
        setPage(state, page) {
            state.page = page;
        },
        setLimit(state, limit) {
            state.limit = limit;
        },
        setSelectedSort(state, sort) {
            state.selectedSort = sort;
        },
        setSearchQuery(state, searchQuery) {
            state.searchQuery = searchQuery;
        },
        setTotalPage(state, totalPages) {
            state.totalPages = totalPages;
        }

    },
    actions: {

        async loadMorePosts({ commit, state }) {

            try {
                commit('setPage', state.page + 1)
                const response = await axios.get("https://jsonplaceholder.typicode.com/posts", {
                    params: {
                        _page: state.page,
                        _limit: state.limit
                    }
                });
                commit('setTotalPages', Math.ceil(response.headers['x-total-count'] / state.limit))
                commit('setPosts', [...state.posts, ...response.data])

            } catch (e) {
                alert("Ошибка")
            } finally {
            }
        },
        async fetchPosts({ commit, state }) {

            try {
                commit('setLoading', true);
                const response = await axios.get("https://jsonplaceholder.typicode.com/posts", {
                    params: {
                        _page: state.page,
                        _limit: state.limit
                    }
                });
                commit('setTotalPages', Math.ceil(response.headers['x-total-count'] / state.limit))
                commit('setPosts', response.data)

            } catch (e) {
                alert("Ошибка")
            } finally {
                commit('setLoading', false);
            }
        },
    },
    namespaced: true
}
