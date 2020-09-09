import { mount } from '@vue/test-utils';
import Test from './test.vue';

const wrapper = mount(Test);

describe('MyName test', function () {
  it('Displays my name when I write it', function () {
    const div = wrapper.find('div');
    expect(div.text()).toBe('hello JP');
  });
});
