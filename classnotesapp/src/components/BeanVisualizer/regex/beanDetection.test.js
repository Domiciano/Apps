import { describe, it, expect } from 'vitest';
import { parseBeans } from './beanDetection';

describe('parseBeans — stereotype annotations', () => {
  it('detects @Component', () => {
    const code = '@Component\npublic class MyService {}';
    const beans = parseBeans(code);
    expect(beans).toHaveLength(1);
    expect(beans[0].type).toBe('component');
    expect(beans[0].className).toBe('MyService');
    expect(beans[0].beanName).toBe('myService');
  });

  it('detects @Service', () => {
    const beans = parseBeans('@Service\npublic class OrderService {}');
    expect(beans[0].type).toBe('service');
    expect(beans[0].beanName).toBe('orderService');
  });

  it('detects @Repository', () => {
    const beans = parseBeans('@Repository\npublic class UserRepo {}');
    expect(beans[0].type).toBe('repository');
    expect(beans[0].beanName).toBe('userRepo');
  });

  it('detects @Controller', () => {
    const beans = parseBeans('@Controller\npublic class HomeController {}');
    expect(beans[0].type).toBe('controller');
  });

  it('maps @RestController to controller type', () => {
    const beans = parseBeans('@RestController\npublic class ApiController {}');
    expect(beans[0].type).toBe('controller');
  });

  it('uses explicit bean name when provided in annotation', () => {
    const beans = parseBeans('@Component("myCustomName")\npublic class SomeClass {}');
    expect(beans[0].beanName).toBe('myCustomName');
  });

  it('camelCases the class name as default bean name', () => {
    const beans = parseBeans('@Component\npublic class ProductRepository {}');
    expect(beans[0].beanName).toBe('productRepository');
  });

  it('detects multiple beans in the same code block', () => {
    const code = '@Component\npublic class A {}\n@Service\npublic class B {}';
    const beans = parseBeans(code);
    expect(beans).toHaveLength(2);
  });

  it('returns empty array for code with no annotations', () => {
    const beans = parseBeans('public class Plain {}');
    expect(beans).toHaveLength(0);
  });

  it('returns empty array for empty string', () => {
    expect(parseBeans('')).toHaveLength(0);
  });
});

describe('parseBeans — @Configuration + @Bean methods', () => {
  it('detects beans defined via @Bean methods in @Configuration class', () => {
    const code = `
@Configuration
public class AppConfig {
  @Bean
  public DataSource dataSource() {
    return new DataSource();
  }
}
public class DataSource {}
    `;
    const beans = parseBeans(code);
    const beanMethod = beans.find(b => b.beanName === 'dataSource');
    expect(beanMethod).toBeDefined();
    expect(beanMethod.type).toBe('bean');
  });
});
